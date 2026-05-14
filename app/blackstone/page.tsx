"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { submitForm, COUNTRY_CODES, isWorkEmail, validatePhone } from "@/lib/form-helpers";

// ═════════════════════════════════════════════════════════════════════════════
// BLACKSTONE eIT × OUTSYSTEMS — Executive Roundtable Riyadh
// Brand: Blackstone eIT (host) · Sponsor: OutSystems
// Brand spec: 2026 V1.0 (see /blackstone eit/*.pdf in repo)
// ═════════════════════════════════════════════════════════════════════════════

// ─── Design tokens (Blackstone eIT brand) ───────────────────────────────────
const BS_NAVY = "#0B1F3B";       // Deep Tech Navy — primary dark surface / authority
const BS_CYAN = "#00C2FF";       // Electric Cyan — accent / innovation
const BS_SILVER = "#F2F4F7";     // Soft Silver — neutral light surface
const BS_WHITE = "#FFFFFF";      // Pure White — clarity
const BS_BLACK = "#0A0A0A";      // Blackstone Black — deepest contrast
const BS_GRAY = "#5A6B7C";       // Steel Gray — balanced neutral
const BS_BLUE = "#145DA0";       // Professional Blue — trust
const BS_LIGHT_BLUE = "#4DA3FF"; // Light Tech Blue — approachability

const EASE = [0.22, 1, 0.36, 1] as const;
const EVENT_DATE = new Date("2026-06-10T10:00:00+03:00");

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
  company: "OutSystems" | "Blackstone eIT";
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
  type: "logistics" | "welcome" | "keynote" | "feature" | "break" | "demo" | "panel" | "closing";
};

const AGENDA: AgendaItem[] = [
  { start: "10:00", end: "11:00", title: "Registration, Welcome Coffee & Networking", owner: "Doors open 10:00 · Programme starts 10:30", type: "logistics" },
  { start: "11:00", end: "11:05", title: "Welcome Remarks & Introduction", owner: "Joyce Raad · Senior Partner Alliances Manager · OutSystems", type: "welcome" },
  { start: "11:05", end: "11:35", title: "Opening Keynote", subtitle: "From Digital Government to AI-Enabled Public Services: Scaling Secure, Citizen-Centric Innovation", owner: "Mohamed Shaaban · Senior Account Executive · OutSystems", type: "keynote" },
  { start: "11:35", end: "12:00", title: "Featured Presentation", subtitle: "Blackstone eIT session", owner: "Youness Soulayman · CTO & Executive Director · Blackstone eIT", type: "feature" },
  { start: "12:00", end: "12:15", title: "Coffee Break & Prayer", type: "break" },
  { start: "12:15", end: "12:45", title: "Applied Government Use Cases", subtitle: "Agentic AI in Action: Live Demo of Government Use Cases", owner: "Omar Istaitieh · Lead Solution Architect · OutSystems", type: "demo" },
  { start: "12:45", end: "13:05", title: "Panel Discussion", owner: "Moderator + Panelists", type: "panel" },
  { start: "13:05", end: "13:20", title: "Closing Remarks & Q&A", owner: "Event Host / Moderator", type: "closing" },
  { start: "13:20", end: "—",     title: "Networking Lunch", owner: "All Delegates", type: "logistics" },
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
function BlackstoneLogomark({ size = 28 }: { size?: number; color?: string; accent?: string }) {
  // Real Blackstone eIT wordmark (blue/cyan hex bracket + white "Blackstone eIT")
  // served from S3 — designed for dark backgrounds. `size` controls rendered height.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://efg-final.s3.eu-north-1.amazonaws.com/logos/BlackstoneeIT_logolight.png"
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

function OutSystemsLogomark({ size = 24 }: { size?: number; color?: string }) {
  // Real OutSystems wordmark (red "O" + white "outsystems") served from S3.
  // `size` controls the rendered height in px; aspect ratio is preserved.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://efg-final.s3.eu-north-1.amazonaws.com/logos/outsystems.png"
      alt="OutSystems"
      style={{
        height: size,
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
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
      background: scrolled ? `${BS_NAVY}ee` : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${BS_CYAN}1a` : "1px solid transparent",
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        padding: "4px clamp(20px, 4vw, 56px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <a href="#top" aria-label={`${BRAND_HOST} home`} style={{ display: "inline-flex", textDecoration: "none" }}>
          <BlackstoneLogomark size={56} color={BS_WHITE} accent={BS_CYAN} />
        </a>

        <div className="bs-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2vw, 32px)" }}>
          {["Overview", "Takeaways", "Speakers", "Agenda", "About"].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              color: "rgba(255,255,255,0.72)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "color 0.3s ease",
            }} className="bs-nav-link">{label}</a>
          ))}
        </div>

        <a href="#register" className="bs-nav-cta" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 999,
          background: `linear-gradient(135deg, ${BS_CYAN}, ${BS_LIGHT_BLUE})`,
          color: BS_NAVY,
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: 12.5, fontWeight: 700,
          letterSpacing: "0.04em",
          textDecoration: "none",
          boxShadow: `0 6px 20px ${BS_CYAN}33`,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}>
          Request Invitation <span aria-hidden>→</span>
        </a>
      </div>

      <style jsx global>{`
        .bs-nav-link:hover { color: ${BS_WHITE} !important; }
        .bs-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 28px ${BS_CYAN}55; }
        @media (max-width: 780px) {
          .bs-nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO — Apple-style: monumental, centered, minimal
// One headline. Lots of breathing room. One soft cyan halo. Nothing else.
// ═════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section id="top" style={{
      position: "relative",
      overflow: "hidden",
      background: "transparent",
      height: "100svh",
      maxHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: "clamp(96px, 11vh, 130px)",
      paddingBottom: "clamp(20px, 2.6vh, 32px)",
      paddingLeft: "clamp(24px, 5vw, 64px)",
      paddingRight: "clamp(24px, 5vw, 64px)",
    }}>
      {/* ── Layer 0: ambient gradient orbs (static, no animation) ── */}
      <div aria-hidden style={{
        position: "absolute", top: "-18%", left: "-12%",
        width: "75%", height: "95%",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BS_CYAN}cc 0%, ${BS_CYAN}66 22%, ${BS_CYAN}26 48%, ${BS_CYAN}0a 68%, transparent 80%)`,
        filter: "blur(30px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "-25%", right: "-14%",
        width: "80%", height: "95%",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BS_BLUE}e6 0%, ${BS_BLUE}80 22%, ${BS_BLUE}33 48%, ${BS_BLUE}14 68%, transparent 80%)`,
        filter: "blur(38px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Layer 1: hex grid (CSS background, static) ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 64'><polygon points='14,2 42,2 55,32 42,62 14,62 1,32' fill='none' stroke='%2300C2FF' stroke-width='0.9' opacity='0.35'/></svg>")
        `,
        backgroundSize: "94px 108px",
        WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.35) 75%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.35) 75%, transparent 100%)",
        opacity: 0.65,
      }} />

      {/* ── Layer 2: bottom vignette for readability ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: `linear-gradient(180deg, transparent 0%, transparent 55%, ${BS_NAVY}cc 85%, ${BS_NAVY} 100%)`,
      }} />

      {/* ── Content stack — auto margins absorb empty space so it sits centered between nav and bottom block ── */}
      <div style={{
        position: "relative", zIndex: 3,
        width: "100%",
        maxWidth: 1100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "clamp(16px, 2.4vh, 28px)",
        margin: "auto 0",
      }}>
        {/* Eyebrow — glass-skeumorphic location · date pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "10px 22px 10px 18px",
            borderRadius: 999,
            background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            border: `1px solid rgba(255,255,255,0.14)`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,0.22) inset,
              0 -1px 0 0 rgba(0,0,0,0.18) inset,
              0 0 0 1px ${BS_CYAN}1f inset,
              0 14px 32px rgba(0,0,0,0.35),
              0 0 28px ${BS_CYAN}22
            `,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(11px, 0.95vw, 12.5px)",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          {/* Specular top highlight — skeumorphic light catch */}
          <span aria-hidden style={{
            position: "absolute",
            top: 1, left: "12%", right: "12%",
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)`,
            borderRadius: 999,
            pointerEvents: "none",
          }} />

          <span className="bs-pulse-dot" style={{
            width: 7, height: 7, borderRadius: "50%",
            background: BS_CYAN,
            boxShadow: `0 0 10px ${BS_CYAN}, 0 0 4px ${BS_CYAN}cc inset`,
          }} />
          <span>Riyadh</span>
          <span aria-hidden style={{
            display: "inline-block",
            width: 3, height: 3, borderRadius: "50%",
            background: `${BS_CYAN}aa`,
            boxShadow: `0 0 6px ${BS_CYAN}66`,
          }} />
          <span style={{ color: BS_WHITE, fontWeight: 700, letterSpacing: "0.22em" }}>10 June 2026</span>
        </motion.div>

        {/* Monumental headline — three lines, generous leading, balanced */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(36px, 6vw, 84px)",
            fontWeight: 700,
            color: BS_WHITE,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: 0,
            textWrap: "balance" as "balance",
          }}
        >
          Empowering Saudi
          <br />
          Public Sector through
          <br />
          <span style={{
            background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 800,
          }}>
            Agentic AI.
          </span>
        </motion.h1>

        {/* One supporting line — Apple sub-headline cadence */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.15vw, 18px)",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 620,
            letterSpacing: "-0.005em",
            textWrap: "balance" as "balance",
          }}
        >
          An invitation-only executive roundtable on scaling agentic AI for Saudi Vision 2030. Hosted by {BRAND_HOST} with {BRAND_SPONSOR}.
        </motion.p>

        {/* Single CTA — premium pill, just one action */}
        <motion.a
          href="#register"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="bs-hero-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginTop: "clamp(8px, 1.6vh, 16px)",
            padding: "14px 28px",
            borderRadius: 999,
            background: BS_WHITE,
            color: BS_NAVY,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: 13.5,
            fontWeight: 700,
            letterSpacing: "0.02em",
            textDecoration: "none",
            boxShadow: `0 1px 0 0 rgba(255,255,255,0.6) inset, 0 12px 36px ${BS_CYAN}33`,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          Request invitation
          <span aria-hidden style={{ fontSize: 15, marginTop: -1 }}>→</span>
        </motion.a>
      </div>

      {/* ── Hero bottom block: meta + countdown ribbon, then host lockup ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        style={{
          position: "relative",
          zIndex: 3,
          flex: "0 0 auto",
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "clamp(14px, 1.8vh, 22px)",
        }}
      >
        {/* Host lockup — Hosted by / With */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(20px, 3.5vw, 44px)",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}>Hosted by</span>
            <BlackstoneLogomark size={50} color={BS_WHITE} accent={BS_CYAN} />
          </div>
          <span aria-hidden style={{ width: 1, height: 22, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}>With</span>
            <OutSystemsLogomark size={40} color={BS_WHITE} />
          </div>
        </div>

        {/* Meta + countdown strip */}
        <div className="bs-hero-meta" style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(14px, 2.4vw, 32px)",
          padding: "clamp(14px, 1.8vh, 20px) 0",
          borderTop: `1px solid ${BS_CYAN}26`,
          borderBottom: `1px solid ${BS_CYAN}26`,
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: BS_CYAN, boxShadow: `0 0 8px ${BS_CYAN}` }} />
              10:00 – 14:20 AST
            </span>
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
      </motion.div>

      <style jsx global>{`
        .bs-hero-cta:hover {
          transform: translateY(-2px);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.6) inset,
            0 18px 48px ${BS_CYAN}55;
        }
        @media (max-width: 760px) {
          .bs-hero-meta { justify-content: flex-start !important; }
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
// OVERVIEW — Why this matters
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
      padding: "clamp(60px, 7vw, 96px) 0",
      overflow: "hidden",
    }}>
      {/* ── Cinematic stage light: single off-screen cyan beam from the upper-right ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-20%",
        right: "-25%",
        width: "60%",
        height: "140%",
        background: `radial-gradient(ellipse 40% 50% at 50% 50%, ${BS_CYAN}33 0%, ${BS_CYAN}10 30%, transparent 60%)`,
        filter: "blur(60px)",
        transform: "rotate(-18deg)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Faint vertical light streak running through the centre — adds depth without clutter ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: 0, bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "70%", maxWidth: 1100,
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${BS_BLUE}1a 0%, transparent 70%)`,
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Letterbox film-frame markers — kept; signature of the section ── */}

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
          {/* Glass-skeu eyebrow pill — refined with hex icon (Blackstone motif) */}
          <span style={{
            position: "relative",
            alignSelf: "flex-start",
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
            {/* Skeu specular */}
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "14%", right: "14%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            {/* Tiny hex icon — picks up the Blackstone bracket motif */}
            <span aria-hidden style={{
              width: 9, height: 10,
              clipPath: "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)",
              background: BS_CYAN,
              boxShadow: `0 0 8px ${BS_CYAN}`,
              flexShrink: 0,
            }} />
            Why this matters
          </span>

          {/* Cinematic headline */}
          <h2 style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(32px, 4.4vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            color: BS_WHITE,
            margin: 0,
            textWrap: "balance" as "balance",
          }}>
            The roadmap from{" "}
            <span style={{
              background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}>AI pilots</span>{" "}
            to agentic public services.
          </h2>

          {/* Italic serif lead — the scene-setter, Apple editorial cadence */}
          <p style={{
            fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "clamp(17px, 1.5vw, 22px)",
            fontWeight: 400,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.86)",
            margin: 0,
            paddingLeft: "clamp(16px, 1.4vw, 22px)",
            borderLeft: `2px solid ${BS_CYAN}77`,
            maxWidth: 540,
          }}>
            The question is no longer <span style={{ color: BS_WHITE, fontStyle: "normal", fontWeight: 600 }}>whether</span> AI will reshape Saudi government —{" "}
            <span style={{ color: BS_CYAN, fontStyle: "normal", fontWeight: 600 }}>but how quickly, and at what scale.</span>
          </p>
        </motion.div>

        {/* ─── RIGHT: the supporting argument inside an elevated glass-skeu panel ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
          style={{ position: "relative" }}
        >
          {/* Soft cyan halo behind the card — gives it cinematic lift */}
          <div aria-hidden style={{
            position: "absolute",
            inset: "-30px",
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${BS_CYAN}1f 0%, transparent 65%)`,
            filter: "blur(36px)",
            zIndex: 0,
            pointerEvents: "none",
          }} />

          <div style={{
            position: "relative",
            zIndex: 1,
            padding: "clamp(30px, 3.2vw, 48px)",
            borderRadius: 20,
            background: `linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.18) 100%)`,
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            border: `1px solid rgba(255,255,255,0.10)`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,0.16) inset,
              0 -1px 0 0 rgba(0,0,0,0.18) inset,
              0 0 0 1px ${BS_CYAN}14 inset,
              0 24px 60px rgba(0,0,0,0.45),
              0 0 60px ${BS_CYAN}1a
            `,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            overflow: "hidden",
          }}>
            {/* Top-edge cyan→blue gradient hairline */}
            <span aria-hidden style={{
              position: "absolute",
              top: 0, left: "8%", right: "8%",
              height: 1.5,
              background: `linear-gradient(90deg, transparent 0%, ${BS_CYAN} 30%, ${BS_LIGHT_BLUE} 70%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            {/* Skeu specular highlight */}
            <span aria-hidden style={{
              position: "absolute",
              top: 1.5, left: "20%", right: "20%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.42) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />

            {/* Cinematic corner brackets — film-frame mark on each corner */}
            {[
              { top: 14, left: 14, borderTop: true, borderLeft: true },
              { top: 14, right: 14, borderTop: true, borderRight: true },
              { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
              { bottom: 14, right: 14, borderBottom: true, borderRight: true },
            ].map((pos, i) => (
              <span key={i} aria-hidden style={{
                position: "absolute",
                ...pos,
                width: 14, height: 14,
                borderTop: pos.borderTop ? `1.5px solid ${BS_CYAN}99` : undefined,
                borderBottom: pos.borderBottom ? `1.5px solid ${BS_CYAN}99` : undefined,
                borderLeft: pos.borderLeft ? `1.5px solid ${BS_CYAN}99` : undefined,
                borderRight: pos.borderRight ? `1.5px solid ${BS_CYAN}99` : undefined,
                pointerEvents: "none",
              }} />
            ))}

            {/* Small label inside the panel */}
            <span style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: BS_CYAN,
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              <span aria-hidden style={{ width: 18, height: 1, background: BS_CYAN, opacity: 0.7 }} />
              Context
            </span>

            <p style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: "clamp(15px, 1.15vw, 17px)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
              margin: 0,
            }}>
              Saudi Arabia&apos;s public sector stands at an inflection point. Vision 2030 has set
              ambitious targets for digital government — and AI is moving fast from
              proof-of-concept into the production fabric of citizen services.
            </p>

            {/* Inline pullquote — structural rest stop between paragraphs */}
            <div style={{
              position: "relative",
              padding: "clamp(14px, 1.4vw, 18px) clamp(18px, 2vw, 24px)",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${BS_CYAN}0f 0%, ${BS_BLUE}0a 100%)`,
              border: `1px solid ${BS_CYAN}26`,
              boxShadow: `
                0 1px 0 0 rgba(255,255,255,0.08) inset,
                0 0 24px ${BS_CYAN}14
              `,
            }}>
              <span aria-hidden style={{
                position: "absolute",
                top: "20%", bottom: "20%", left: -1,
                width: 2.5,
                background: `linear-gradient(180deg, transparent 0%, ${BS_CYAN} 50%, transparent 100%)`,
                boxShadow: `0 0 10px ${BS_CYAN}66`,
              }} />
              <p style={{
                fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.25vw, 18px)",
                fontWeight: 400,
                lineHeight: 1.5,
                color: BS_WHITE,
                margin: 0,
                letterSpacing: "-0.005em",
              }}>
                The work now is{" "}
                <span style={{ fontStyle: "normal", fontWeight: 700, color: BS_CYAN, fontFamily: "var(--font-montserrat), system-ui, sans-serif", letterSpacing: 0 }}>past the slideware</span>
                {" "}— into the operating model.
              </p>
            </div>

            <p style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontSize: "clamp(15px, 1.15vw, 17px)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              margin: 0,
            }}>
              This invite-only roundtable convenes a focused circle of senior IT leaders, CDOs and
              digital transformation heads with the {BRAND_HOST} and {BRAND_SPONSOR} teams —
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
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                whiteSpace: "nowrap",
              }}>
                Focus areas
              </span>
              <span aria-hidden style={{
                flex: 1, height: 1,
                background: `linear-gradient(90deg, rgba(255,255,255,0.18) 0%, transparent 100%)`,
              }} />
            </div>

            {/* Glass-skeu tag pills — premium treatment */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              marginTop: -8,
            }}>
              {TAGS.map((t, i) => (
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
                    background: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)`,
                    border: `1px solid rgba(255,255,255,0.12)`,
                    boxShadow: `
                      0 1px 0 0 rgba(255,255,255,0.20) inset,
                      0 0 0 1px ${BS_CYAN}1a inset,
                      0 6px 16px rgba(0,0,0,0.28)
                    `,
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    color: BS_WHITE,
                  }}
                >
                  <span aria-hidden style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: BS_CYAN,
                    boxShadow: `0 0 6px ${BS_CYAN}aa`,
                  }} />
                  {t}
                </motion.span>
              ))}
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

  // Editorial theme keywords paired with each takeaway sentence
  const ITEMS = [
    { theme: "Scale", text: "Moving from AI pilots to scalable, agentic government services." },
    { theme: "Trust", text: "Balancing innovation, governance and trust in agentic AI adoption." },
    { theme: "Impact", text: "Driving citizen impact and operational efficiency through automation and AI." },
  ];

  return (
    <section id="takeaways" ref={ref} style={{
      position: "relative",
      background: "transparent",
      padding: "clamp(60px, 7vw, 96px) 0",
      overflow: "hidden",
    }}>
      {/* ── Overhead cyan stage-light spotlight (from top centre, fanning down) ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "85%",
        height: "100%",
        background: `radial-gradient(ellipse 40% 60% at 50% 50%, ${BS_CYAN}33 0%, ${BS_CYAN}10 35%, transparent 65%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Faint blue floor wash (anchors the bottom, gives stage-floor feel) ── */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        height: "55%",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BS_BLUE}22 0%, transparent 70%)`,
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Letterbox film-frame markers (section signature, consistent with Overview) ── */}

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
            marginBottom: "clamp(36px, 4.5vw, 56px)",
            textAlign: "center",
          }}
        >
          {/* Glass-skeu eyebrow pill (matches Overview vocabulary — hex icon, same skeu specs) */}
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
            What you&apos;ll take away
          </span>

          {/* Centered cinematic headline */}
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
            Three conversations{" "}
            <span style={{
              background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}>worth your morning.</span>
          </h2>

          {/* Supporting line — Apple sub-headline cadence */}
          <p style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.1vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 560,
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
          {ITEMS.map(({ theme, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: EASE }}
              className="bs-takeaway-card"
              style={{
                position: "relative",
                padding: "clamp(18px, 1.7vw, 24px)",
                borderRadius: 16,
                // Multi-layer refractive glass — radial dome highlight + linear bevel + tinted refraction
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
                  0 0 70px ${BS_CYAN}1f,
                  0 0 1px rgba(255,255,255,0.06)
                `,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "clamp(12px, 1.4vw, 18px)",
                minHeight: "clamp(170px, 13vw, 210px)",
                overflow: "hidden",
                transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              {/* Top-edge cyan→blue gradient hairline */}
              <span aria-hidden style={{
                position: "absolute",
                top: 0, left: "8%", right: "8%",
                height: 1.5,
                background: `linear-gradient(90deg, transparent 0%, ${BS_CYAN} 30%, ${BS_LIGHT_BLUE} 70%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: 2,
              }} />
              {/* Skeu specular highlight directly under top hairline */}
              <span aria-hidden style={{
                position: "absolute",
                top: 1.5, left: "20%", right: "20%",
                height: 1,
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: 2,
              }} />

              {/* Diagonal sheen band — the "liquid glass" moving light reflection */}
              <span aria-hidden className="bs-takeaway-sheen" style={{
                position: "absolute",
                top: "-30%",
                left: "-30%",
                width: "60%",
                height: "200%",
                background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.05) 58%, transparent 100%)`,
                transform: "rotate(8deg)",
                pointerEvents: "none",
                zIndex: 1,
                transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
              }} />

              {/* Bottom-edge dark seal — completes the skeumorphic bevel */}
              <span aria-hidden style={{
                position: "absolute",
                bottom: 0, left: "12%", right: "12%",
                height: 1,
                background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: 2,
              }} />

              {/* ─── BACKGROUND watermark numeral — partly clipped at bottom-right ─── */}
              <span aria-hidden style={{
                position: "absolute",
                bottom: "-0.16em",
                right: "-0.06em",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(110px, 12vw, 160px)",
                lineHeight: 0.85,
                letterSpacing: "-0.06em",
                background: `linear-gradient(160deg, ${BS_CYAN}33 0%, ${BS_CYAN}1a 40%, ${BS_BLUE}0d 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
                fontVariantNumeric: "tabular-nums",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

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
                  borderTop: pos.borderTop ? `1.5px solid ${BS_CYAN}88` : undefined,
                  borderBottom: pos.borderBottom ? `1.5px solid ${BS_CYAN}88` : undefined,
                  borderLeft: pos.borderLeft ? `1.5px solid ${BS_CYAN}88` : undefined,
                  borderRight: pos.borderRight ? `1.5px solid ${BS_CYAN}88` : undefined,
                  pointerEvents: "none",
                  zIndex: 2,
                }} />
              ))}

              {/* Theme keyword (italic Georgia serif, cyan — centered, with hairline on each side) */}
              <span style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.2vw, 18px)",
                fontWeight: 400,
                letterSpacing: "0.04em",
                color: BS_CYAN,
                textTransform: "lowercase",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}>
                <span aria-hidden style={{ width: 14, height: 1, background: `linear-gradient(90deg, transparent, ${BS_CYAN})` }} />
                {theme}
                <span aria-hidden style={{ width: 14, height: 1, background: `linear-gradient(90deg, ${BS_CYAN}, transparent)` }} />
              </span>

              {/* Body — centered, sits over the watermark numeral */}
              <p style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "clamp(17px, 1.4vw, 21px)",
                fontWeight: 500,
                lineHeight: 1.45,
                color: BS_WHITE,
                margin: 0,
                letterSpacing: "-0.01em",
                textWrap: "balance" as "balance",
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
          border-color: rgba(255,255,255,0.22) !important;
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.32) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.26) inset,
            0 0 0 1px ${BS_CYAN}33 inset,
            0 1px 2px rgba(0,0,0,0.18) inset,
            0 32px 70px rgba(0,0,0,0.55),
            0 0 100px ${BS_CYAN}3a !important;
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
// SPEAKERS — 4 speakers, no bios
// ═════════════════════════════════════════════════════════════════════════════
function SpeakerCard({ s, idx, inView }: { s: Speaker; idx: number; inView: boolean }) {
  const initials = s.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const companyColor = s.company === "Blackstone eIT" ? BS_CYAN : BS_LIGHT_BLUE;
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
        position: "relative",
        padding: "clamp(24px, 2.2vw, 32px) clamp(22px, 2vw, 28px) clamp(20px, 1.8vw, 26px)",
        borderRadius: 18,
        // Liquid-glass + skeu refractive composite (same vocabulary as Takeaways cards)
        background: `
          radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 80% 100%, ${companyColor}1f 0%, transparent 55%),
          linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.18) 100%)
        `,
        backdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
        WebkitBackdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
        border: `1px solid rgba(255,255,255,0.14)`,
        boxShadow: `
          0 1.5px 0 0 rgba(255,255,255,0.28) inset,
          0 -1.5px 0 0 rgba(0,0,0,0.24) inset,
          0 0 0 1px ${companyColor}1f inset,
          0 1px 2px rgba(0,0,0,0.18) inset,
          0 24px 56px rgba(0,0,0,0.5),
          0 0 70px ${companyColor}1f
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
          background: `linear-gradient(140deg, ${companyColor}, ${BS_LIGHT_BLUE}55, ${companyColor})`,
          boxShadow: `0 12px 28px rgba(0,0,0,0.4)`,
        }} />
        {/* Inner hex containing the photo (3px frame) */}
        <div style={{
          position: "absolute", inset: 3,
          clipPath: HEX_CLIP,
          background: `linear-gradient(135deg, ${BS_NAVY}, ${BS_BLACK})`,
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

      {/* Name */}
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
      }}>
        {s.name}
      </h3>

      {/* Title */}
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
      }}>
        {s.title}
      </p>

      {/* Company logo — real Blackstone / OutSystems lockup */}
      <div style={{
        position: "relative",
        zIndex: 2,
        marginTop: 4,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.92,
      }} aria-label={s.company}>
        {s.company === "Blackstone eIT" ? (
          <BlackstoneLogomark size={38} />
        ) : (
          <OutSystemsLogomark size={32} />
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
            }}>panelists.</span>
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
            A focused circle of voices from {BRAND_HOST} and {BRAND_SPONSOR} — moderating the conversation and bringing the field experience to the room.
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
          border-color: rgba(255,255,255,0.22) !important;
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.32) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.26) inset,
            0 0 0 1px rgba(255,255,255,0.18) inset,
            0 1px 2px rgba(0,0,0,0.18) inset,
            0 32px 70px rgba(0,0,0,0.55),
            0 0 100px rgba(0, 194, 255, 0.24) !important;
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
// AGENDA — 9 items run of show
// ═════════════════════════════════════════════════════════════════════════════
function agendaTypeStyle(type: AgendaItem["type"]) {
  switch (type) {
    case "keynote":
      return { label: "Keynote", color: BS_CYAN };
    case "feature":
      return { label: "Featured", color: BS_LIGHT_BLUE };
    case "panel":
      return { label: "Panel", color: BS_CYAN };
    case "demo":
      return { label: "Live demo", color: BS_LIGHT_BLUE };
    case "welcome":
      return { label: "Welcome", color: "rgba(255,255,255,0.55)" };
    case "closing":
      return { label: "Closing", color: "rgba(255,255,255,0.55)" };
    case "break":
      return { label: "Break", color: "rgba(255,255,255,0.42)" };
    case "logistics":
    default:
      return { label: "Networking", color: "rgba(255,255,255,0.42)" };
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
      {/* Column header — editorial: italic Georgia label + Montserrat time range + hairline */}
      <div style={{
        display: "flex", flexDirection: "column",
        gap: 8,
        marginBottom: "clamp(6px, 1vh, 12px)",
      }}>
        <span style={{
          fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: "clamp(28px, 3.4vw, 44px)",
          fontWeight: 400,
          color: accentColor,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          textTransform: "lowercase",
        }}>
          {label}.
        </span>
        <span style={{
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          display: "inline-flex", alignItems: "center", gap: 12,
          fontVariantNumeric: "tabular-nums",
        }}>
          <span aria-hidden style={{
            width: 24, height: 1,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
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

// ─── Reusable: a single agenda card ───
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
  const HEX_CLIP = "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)";
  const type = agendaTypeStyle(item.type);
  const isAccented = type.color === BS_CYAN || type.color === BS_LIGHT_BLUE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: columnDelay + 0.15 + idx * 0.06, ease: EASE }}
      className="bs-agenda-card"
      style={{
        position: "relative",
        padding: "clamp(18px, 1.8vw, 24px)",
        borderRadius: 14,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 60%),
          linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.18) 100%)
        `,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `
          0 1px 0 0 rgba(255,255,255,0.16) inset,
          0 -1px 0 0 rgba(0,0,0,0.16) inset,
          0 0 0 1px ${isAccented ? type.color + "1a" : BS_CYAN + "10"} inset,
          0 14px 30px rgba(0,0,0,0.28)
        `,
        overflow: "hidden",
        transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Top hairline */}
      <span aria-hidden style={{
        position: "absolute", top: 0, left: "6%", right: "6%", height: 1.5,
        background: isAccented
          ? `linear-gradient(90deg, transparent 0%, ${type.color} 50%, transparent 100%)`
          : `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)`,
        pointerEvents: "none",
      }} />
      {/* Specular */}
      <span aria-hidden style={{
        position: "absolute", top: 1.5, left: "18%", right: "18%", height: 1,
        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.42) 50%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      {/* Top row: hex bullet + time range + type pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span aria-hidden style={{
          display: "inline-block",
          width: 10, height: 12,
          clipPath: HEX_CLIP,
          background: isAccented
            ? `linear-gradient(135deg, ${type.color}, ${BS_LIGHT_BLUE})`
            : `${BS_NAVY}`,
          border: isAccented ? "none" : `1.5px solid ${BS_CYAN}aa`,
          boxShadow: isAccented ? `0 0 10px ${type.color}aa` : "none",
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: "clamp(13px, 1.05vw, 15px)",
          fontWeight: 700,
          color: BS_WHITE,
          letterSpacing: "-0.005em",
          fontVariantNumeric: "tabular-nums",
        }}>
          {item.start} <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>–</span> {item.end}
        </span>
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: isAccented ? type.color : "rgba(255,255,255,0.55)",
          padding: "3.5px 9px",
          borderRadius: 999,
          background: isAccented
            ? `linear-gradient(180deg, ${type.color}1f 0%, ${type.color}0a 100%)`
            : "rgba(255,255,255,0.04)",
          border: isAccented
            ? `1px solid ${type.color}55`
            : `1px solid rgba(255,255,255,0.08)`,
          boxShadow: isAccented
            ? `0 1px 0 0 rgba(255,255,255,0.14) inset, 0 0 10px ${type.color}33`
            : `0 1px 0 0 rgba(255,255,255,0.08) inset`,
        }}>
          {type.label}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: "clamp(15.5px, 1.3vw, 19px)",
        fontWeight: 700,
        color: BS_WHITE,
        margin: 0,
        letterSpacing: "-0.015em",
        lineHeight: 1.25,
        textWrap: "balance" as "balance",
      }}>
        {item.title}
      </h3>

      {/* Subtitle */}
      {item.subtitle && (
        <p style={{
          fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: "clamp(13px, 1.05vw, 15.5px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.78)",
          margin: 0,
          lineHeight: 1.45,
          letterSpacing: "-0.005em",
        }}>
          {item.subtitle}
        </p>
      )}

      {/* Owner */}
      {item.owner && (
        <p style={{
          margin: 0,
          display: "inline-flex", alignItems: "center", gap: 9,
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: "clamp(11.5px, 0.9vw, 13px)",
          fontWeight: 500,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.4,
        }}>
          <span aria-hidden style={{
            width: 5, height: 5, borderRadius: "50%",
            background: isAccented ? type.color : BS_CYAN,
            boxShadow: `0 0 6px ${isAccented ? type.color : BS_CYAN}aa`,
            flexShrink: 0,
          }} />
          {item.owner}
        </p>
      )}
    </motion.div>
  );
}

function AgendaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const HEX_CLIP = "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)";

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
      padding: "clamp(60px, 7vw, 96px) 0",
      overflow: "hidden",
    }}>
      {/* ── Two tonal washes — cooler cyan on the LEFT (morning), warmer cyan→blue on the RIGHT (afternoon) ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-10%", left: "-12%",
        width: "55%", height: "85%",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BS_CYAN}3a 0%, ${BS_CYAN}14 35%, transparent 70%)`,
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-15%", right: "-12%",
        width: "55%", height: "85%",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BS_BLUE}55 0%, ${BS_BLUE}1f 35%, transparent 70%)`,
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Center vertical light beam — the "divider" between morning and afternoon, glows through the centre ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "8%", bottom: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(320px, 30%)",
        background: `radial-gradient(ellipse 40% 60% at 50% 50%, ${BS_CYAN}22 0%, transparent 65%)`,
        filter: "blur(50px)",
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
            marginBottom: "clamp(36px, 4.5vw, 56px)",
            maxWidth: 820,
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
            Run of show · 10 June 2026
          </span>

          <h2 style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(32px, 4.4vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            color: BS_WHITE,
            margin: 0,
            textWrap: "balance" as "balance",
          }}>
            A focused morning.{" "}
            <span style={{
              background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}>Lunch to keep talking.</span>
          </h2>

          <p style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.1vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 640,
            letterSpacing: "-0.003em",
          }}>
            10:00–14:20 AST · Fairmont Riyadh. Three substantive talks, a working demo and a panel — then we sit down together over lunch.
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
          {/* Vertical cyan divider beam between morning + afternoon */}
          <div aria-hidden className="bs-agenda-divider" style={{
            position: "absolute",
            top: "20px",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            background: `linear-gradient(180deg, transparent 0%, ${BS_CYAN}55 12%, ${BS_CYAN}55 88%, transparent 100%)`,
            boxShadow: `0 0 14px ${BS_CYAN}44`,
            pointerEvents: "none",
          }} />

          {/* ── LEFT: Morning column ── */}
          <AgendaColumn
            label="Morning"
            timeRange="10:00 – 12:00"
            items={morningItems}
            inView={inView}
            startDelay={0.15}
            accentColor={BS_CYAN}
          />

          {/* ── RIGHT: Afternoon column ── */}
          <AgendaColumn
            label="Afternoon"
            timeRange="12:00 – 14:20"
            items={afternoonItems}
            inView={inView}
            startDelay={0.4}
            accentColor={BS_LIGHT_BLUE}
          />
        </div>
      </div>

      <style jsx global>{`
        .bs-agenda-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.14) !important;
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.22) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.2) inset,
            0 0 0 1px ${BS_CYAN}26 inset,
            0 24px 50px rgba(0,0,0,0.42),
            0 0 60px ${BS_CYAN}26 !important;
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

  const blocks: Array<{
    label: string;
    title: string;
    logo: React.ReactNode;
    body: string;
    href: string;
    accent: string;
  }> = [
    {
      label: "hosted by",
      title: BRAND_HOST,
      logo: <BlackstoneLogomark size={64} color={BS_WHITE} accent={BS_CYAN} />,
      body: `${BRAND_HOST} is a digital transformation and enterprise technology partner working with public sector and large enterprise clients across the Kingdom. Through deep expertise in low-code, AI, agentic systems and mission-critical platforms, the firm helps institutions ship outcomes — not just experiments — at the pace Vision 2030 demands.`,
      href: "https://blackstoneeit.com/",
      accent: BS_CYAN,
    },
    {
      label: "with",
      title: BRAND_SPONSOR,
      logo: <OutSystemsLogomark size={52} color={BS_WHITE} />,
      body: `${BRAND_SPONSOR} is the global leader in high-performance application development, powering AI-era software for governments and enterprises worldwide. Its platform unifies AI, low-code and mission-critical engineering — letting institutions move from idea to in-production citizen service in weeks, with the security, governance and scale public sector requires.`,
      href: "https://www.outsystems.com/",
      accent: BS_LIGHT_BLUE,
    },
  ];

  return (
    <section id="about" ref={ref} style={{
      position: "relative",
      background: "transparent",
      padding: "clamp(60px, 7vw, 96px) 0",
      overflow: "hidden",
    }}>
      {/* ── Twin overhead spotlights — cyan illuminates the LEFT (Blackstone), light-blue illuminates the RIGHT (OutSystems) ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-25%",
        left: "5%",
        width: "45%",
        height: "120%",
        background: `radial-gradient(ellipse 35% 50% at 50% 50%, ${BS_CYAN}3a 0%, ${BS_CYAN}14 35%, transparent 65%)`,
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute",
        top: "-25%",
        right: "5%",
        width: "45%",
        height: "120%",
        background: `radial-gradient(ellipse 35% 50% at 50% 50%, ${BS_LIGHT_BLUE}33 0%, ${BS_LIGHT_BLUE}10 35%, transparent 65%)`,
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

      {/* ── Letterbox frame markers (signature) ── */}

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
              clipPath: HEX_CLIP,
              background: BS_CYAN,
              boxShadow: `0 0 8px ${BS_CYAN}`,
              flexShrink: 0,
            }} />
            Behind the table
          </span>

          {/* Headline */}
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
            About{" "}
            <span style={{
              background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}>the hosts.</span>
          </h2>

          {/* Supporting line */}
          <p style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.1vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 600,
            letterSpacing: "-0.003em",
          }}>
            Two organisations convening this morning — one rooted in the Kingdom&apos;s public-sector transformation, one powering the global AI-era platform behind it.
          </p>
        </motion.div>

        {/* 2-column host grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(22px, 2.6vw, 36px)",
        }} className="bs-about-grid">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.15, ease: EASE }}
              className="bs-about-card"
              style={{
                position: "relative",
                padding: "clamp(32px, 3vw, 48px)",
                borderRadius: 20,
                // Liquid-glass + skeu refractive composite — full vocabulary
                background: `
                  radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, transparent 55%),
                  radial-gradient(ellipse 70% 50% at 80% 100%, ${b.accent}1f 0%, transparent 55%),
                  linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.18) 100%)
                `,
                backdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
                WebkitBackdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
                border: `1px solid rgba(255,255,255,0.14)`,
                boxShadow: `
                  0 1.5px 0 0 rgba(255,255,255,0.28) inset,
                  0 -1.5px 0 0 rgba(0,0,0,0.24) inset,
                  0 0 0 1px ${b.accent}1f inset,
                  0 1px 2px rgba(0,0,0,0.18) inset,
                  0 24px 56px rgba(0,0,0,0.5),
                  0 0 80px ${b.accent}1f
                `,
                display: "flex",
                flexDirection: "column",
                gap: "clamp(20px, 2.2vw, 28px)",
                overflow: "hidden",
                transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              {/* Top hairline — brand accent */}
              <span aria-hidden style={{
                position: "absolute",
                top: 0, left: "8%", right: "8%", height: 1.5,
                background: `linear-gradient(90deg, transparent 0%, ${b.accent} 50%, transparent 100%)`,
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

              {/* Cinematic corner brackets — in brand accent */}
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
                  borderTop: pos.borderTop ? `1.5px solid ${b.accent}aa` : undefined,
                  borderBottom: pos.borderBottom ? `1.5px solid ${b.accent}aa` : undefined,
                  borderLeft: pos.borderLeft ? `1.5px solid ${b.accent}aa` : undefined,
                  borderRight: pos.borderRight ? `1.5px solid ${b.accent}aa` : undefined,
                  pointerEvents: "none",
                  zIndex: 3,
                }} />
              ))}

              {/* Editorial label — italic Georgia serif (matches Takeaways vocabulary) */}
              <span style={{
                position: "relative", zIndex: 2,
                fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.2vw, 18px)",
                fontWeight: 400,
                color: b.accent,
                letterSpacing: "0.04em",
                display: "inline-flex", alignItems: "center", gap: 12,
              }}>
                <span aria-hidden style={{ width: 18, height: 1, background: `linear-gradient(90deg, transparent, ${b.accent})` }} />
                {b.label}
              </span>

              {/* Logo — anchor element */}
              <div style={{
                position: "relative", zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                minHeight: 68,
              }}>
                {b.logo}
              </div>

              {/* Body */}
              <p style={{
                position: "relative", zIndex: 2,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "clamp(14.5px, 1.1vw, 16.5px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.78)",
                margin: 0,
                letterSpacing: "-0.003em",
              }}>
                {b.body}
              </p>

              {/* Visit website — glass-skeu CTA pill */}
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bs-about-cta"
                style={{
                  position: "relative", zIndex: 2,
                  marginTop: "auto",
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: `linear-gradient(180deg, ${b.accent}26 0%, ${b.accent}0a 100%)`,
                  border: `1px solid ${b.accent}66`,
                  boxShadow: `
                    0 1px 0 0 rgba(255,255,255,0.18) inset,
                    0 0 16px ${b.accent}33
                  `,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: BS_WHITE,
                  textDecoration: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                }}
              >
                Visit website
                <span aria-hidden style={{ fontSize: 14, marginTop: -1 }}>↗</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .bs-about-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.22) !important;
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.32) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.26) inset,
            0 0 0 1px rgba(255,255,255,0.18) inset,
            0 1px 2px rgba(0,0,0,0.18) inset,
            0 32px 70px rgba(0,0,0,0.55),
            0 0 100px rgba(0, 194, 255, 0.24) !important;
        }
        .bs-about-cta:hover {
          transform: translateY(-1px);
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
      event_name: "Executive Roundtable Riyadh — Blackstone eIT × OutSystems · 10 June 2026",
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
            }}>invitation only.</span>
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
            The {BRAND_HOST} team reviews every request to keep the room intimate — typically 15–20 senior IT executives from Saudi public-sector entities.
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
                Request received.
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
        <BlackstoneLogomark size={44} color={BS_WHITE} accent={BS_CYAN} />
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
      <OverviewSection />
      <TakeawaysSection />
      <SpeakersSection />
      <AgendaSection />
      <AboutSection />
      <RegisterSection />
      <BlackstoneFooter />
    </div>
  );
}
