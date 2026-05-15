"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { submitForm, COUNTRY_CODES, validatePhone, type CountryCode } from "@/lib/form-helpers";

// Lazy-load the WebGL shader runtime so it doesn't ship in the initial JS bundle.
// Hero falls back to its dark gradient bg until the shader hydrates.
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ─── Seagate Design Tokens — black + lime green + teal (real Seagate brand) ──
const SG_NAVY = "#05070A";        // Primary ink (was navy — renamed semantically below)
const SG_NAVY_DEEP = "#0A0E12";   // Slightly lifted ink
const SG_ORANGE = "#71B53F";      // Seagate lime green — primary accent
const SG_GREEN_BRIGHT = "#8FE060"; // Brighter green for shimmer highlights
const SG_GREEN_DEEP = "#1F4F22";   // Deep green for blooms
const SG_TEAL = "#3FB99B";        // Teal accent for gradient blends
const SG_BLACK = "#020405";
const SG_WHITE = "#ffffff";
const SG_BONE = "#F6F4F0";        // Off-white body bg (premium feel)
const SG_GRAY = "#86909E";        // Muted text
const SG_GRAY_DEEP = "#4A5563";   // Stronger muted text
const SG_HAIRLINE = "rgba(10,14,18,0.10)";

const LOGO_2C_NEG = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/seagate_2c_horizontal_neg1.png"; // green swoosh + white wordmark (for dark bg)

const EVENT_TARGET = "2026-06-11T10:30:00+04:00";

// ─── Data ────────────────────────────────────────────────────────────────────
const TAKEAWAYS = [
  {
    n: "01",
    heading: "The Future of Mass Capacity Storage",
    desc: "Where storage is headed as enterprises absorb the data demands of AI, edge, and hyperscale workloads.",
  },
  {
    n: "02",
    heading: "Practical Paths to Better Infrastructure",
    desc: "How to evolve your existing data centre footprint toward higher density, lower energy, and lower TCO.",
  },
  {
    n: "03",
    heading: "Inside Mozaic 4+",
    desc: "Seagate's path to higher capacity drives — and what it unlocks for storage architects designing for the next decade.",
  },
];

const AGENDA = [
  { start: "10:30", end: "11:00", duration: "30 min", segment: "Guest Arrival, Registration & Welcome Coffee", owner: "Event Operations Team", type: "neutral" as const },
  { start: "11:00", end: "11:05", duration: "5 min",  segment: "Welcome Remarks & House Keeping", owner: "Event Host / Moderator", type: "neutral" as const },
  { start: "11:05", end: "11:35", duration: "30 min", segment: "Opening Keynote Presentation", owner: "Lead Speaker / Sponsor", type: "feature" as const },
  { start: "11:35", end: "12:05", duration: "30 min", segment: "Featured Presentation", owner: "Industry Speaker / Sponsor", type: "feature" as const },
  { start: "12:05", end: "12:30", duration: "25 min", segment: "Networking Coffee Break", owner: "All Delegates", type: "break" as const },
  { start: "12:30", end: "13:00", duration: "30 min", segment: "Panel Discussion", owner: "Moderator + Panelists", type: "feature" as const },
  { start: "13:00", end: "13:30", duration: "30 min", segment: "Sponsor Product Demonstration", owner: "Sponsor Presenter", type: "neutral" as const },
  { start: "13:30", end: "13:35", duration: "5 min",  segment: "Closing Remarks & Vote of Thanks", owner: "Event Host / Moderator", type: "neutral" as const },
  { start: "13:35", end: "—",     duration: "—",      segment: "Networking Lunch", owner: "All Delegates", type: "break" as const },
];

type Speaker = {
  name: string;
  title: string;
  org: string;
  role: "Moderator" | "Panelist";
  photo: string;
  photoTBD?: boolean;
  bio?: string;
  linkedin?: string;
  photoZoom?: number;
};

const SPEAKERS: Speaker[] = [
  {
    name: "Mohit Pandey",
    title: "Head of Sales — META (Middle East, Türkiye, Africa)",
    org: "Seagate Technology",
    role: "Moderator",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Mohit_Pandey.png",
    linkedin: "https://www.linkedin.com/in/mohit-pandey-70038932/",
  },
  {
    name: "Arnab Majumder",
    title: "Enterprise Sales Lead — MENA",
    org: "Seagate Technology",
    role: "Panelist",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Arnab_Majumder.png",
    linkedin: "https://www.linkedin.com/in/arnab-majumder-26340839/",
  },
  {
    name: "Okan Horasan",
    title: "Country Manager",
    org: "Seagate Technology",
    role: "Panelist",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Okan_Horasan.png",
    linkedin: "https://www.linkedin.com/in/okan-horasan-11b8892b/",
  },
  {
    name: "Allan Bilek",
    title: "Country Manager",
    org: "Seagate Technology",
    role: "Panelist",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Allan_Bilek.png",
    linkedin: "https://www.linkedin.com/in/allanbilekbusiness/",
    photoZoom: 1.22,
  },
];

// ─── Countdown ───────────────────────────────────────────────────────────────
const CountdownDisplay = memo(function CountdownDisplay({ target }: { target: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      gap: "clamp(8px, 1.2vw, 14px)",
      padding: "8px 14px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    }}>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginRight: 4 }}>
        Starts in
      </span>
      {[{ v: t.d, l: "D" }, { v: t.h, l: "H" }, { v: t.m, l: "M" }, { v: t.s, l: "S" }].map((item, i) => (
        <React.Fragment key={item.l}>
          {i > 0 && <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 11 }}>:</span>}
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontSize: "clamp(16px, 1.5vw, 19px)", fontWeight: 700, color: SG_WHITE, letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {String(item.v).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em" }}>
              {item.l}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
});

// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "takeaways", label: "Takeaways" },
  { id: "speakers", label: "Speakers" },
  { id: "agenda", label: "Agenda" },
  { id: "about", label: "About" },
];

function SeagateNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost section that's visible (most prominent in viewport)
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        if (top.target.id) setActiveSection(top.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: "clamp(12px, 1.6vw, 18px) clamp(20px, 4vw, 56px)",
      background: scrolled ? "rgba(5,7,10,0.82)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    }}>
      {/* Logo */}
      <a href="#top" aria-label="Seagate" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
        <Image
          src={LOGO_2C_NEG}
          alt="Seagate"
          width={320}
          height={64}
          priority
          unoptimized={false}
          style={{
            height: "clamp(44px, 5vw, 64px)",
            width: "auto",
            marginBlock: "clamp(-20px, -1.5vw, -13px)",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
          }}
        />
      </a>

      {/* Section links — desktop */}
      <nav className="sg-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2.6vw, 36px)" }}>
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: 13, fontWeight: 500, letterSpacing: "-0.005em",
                color: isActive ? SG_WHITE : "rgba(255,255,255,0.65)",
                textDecoration: "none",
                position: "relative",
                padding: "6px 0",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = SG_WHITE; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? SG_WHITE : "rgba(255,255,255,0.65)"; }}
            >
              {link.label}
              {/* Active underline */}
              <span style={{
                position: "absolute", left: 0, right: 0, bottom: -2, height: 2,
                background: SG_ORANGE,
                borderRadius: 1,
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "center",
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }} />
            </a>
          );
        })}
      </nav>

      {/* Register CTA */}
      <a
        href="#register"
        className="sg-nav-cta"
        aria-label="Request invitation"
        style={{
          fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
          color: SG_WHITE, textDecoration: "none",
          padding: "9px 16px", borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.22)",
          transition: "all 0.3s ease",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = SG_ORANGE; e.currentTarget.style.borderColor = SG_ORANGE; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
      >
        Request Invitation
      </a>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @media (max-width: 760px) {
          .sg-nav-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

// Deterministic seeded PRNG so particles render identically SSR ↔ client.
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Round to 4 decimal places — keeps cx/cy/r values stable across
// SSR (Node) and client serialization paths so React's hydrator doesn't
// flag attribute mismatches.
const round4 = (n: number) => Math.round(n * 10000) / 10000;

// 60 particles along a sweeping J-curve. Lighter than the original 130
// to keep per-frame compositor work down — uses a single drop-shadow
// per circle (was two) and no mix-blend-mode, which together cut
// rasterization cost by ~70% while keeping the same visual atmosphere.
const PARTICLE_PALETTE = ["#75C04F", "#3FB99B", "#5FE8A0", "#A8E667", "#FFC56B", "#7CD8B8"];
const PARTICLES = (() => {
  const rng = makeRng(20260610);
  const total = 60;
  const arr: Array<{ cx: number; cy: number; r: number; color: string; opacity: number; delay: number; duration: number; drift: number }> = [];
  for (let i = 0; i < total; i++) {
    const t = i / total;
    const baseX = 8 + t * 88;
    const baseY = 40 + Math.sin(t * Math.PI * 0.95) * 36 - (1 - t) * 12;
    const thickness = (rng() - 0.5) * 14;
    const cx = baseX + thickness;
    const cy = baseY + (rng() - 0.5) * 12;
    const r = 0.4 + rng() * rng() * 2.4;
    const color = PARTICLE_PALETTE[Math.floor(rng() * PARTICLE_PALETTE.length)];
    const opacity = 0.35 + rng() * 0.55;
    const delay = rng() * 6;
    const duration = 4 + rng() * 6;
    const drift = (rng() - 0.5) * 14;
    arr.push({
      cx: round4(cx),
      cy: round4(cy),
      r: round4(r),
      color,
      opacity: round4(opacity),
      delay: round4(delay),
      duration: round4(duration),
      drift: round4(drift),
    });
  }
  return arr;
})();

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  // Hero content is always visible by default (no inView/opacity gating).
  // The reveal is a pure CSS @keyframes animation with no JS state.
  //
  // Cursor-follow spotlight REMOVED — the mousemove handler was updating
  // a CSS variable on every tick, forcing the compositor to repaint a
  // page-sized radial-gradient layer. Combined with the particle SVG +
  // backdrop-filter on the pullquote, it caused composite layers to drop
  // frames on Mac and large Windows displays (headline letters
  // momentarily disappearing, image artifacts in the next section).

  return (
    <section ref={ref} id="top" style={{
      position: "relative", overflow: "hidden",
      background: "#000000",
      minHeight: "100svh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      paddingTop: "clamp(96px, 11vh, 130px)",
      paddingBottom: "clamp(36px, 5vh, 60px)",
    }}>
      {/* ── Layer 0: Mesh gradient — vivid green/teal swirls on pure black ── */}
      <MeshGradient
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
        colors={["#000000", "#020806", "#0a2418", "#1f5a32", "#3FB99B"]}
        speed={0.32}
        distortion={0.7}
        swirl={0.55}
        grainOverlay={0.08}
      />

      {/* ── Layer 1: Diagonal teal slash — Seagate hero signature cut ── */}
      <div
        aria-hidden
        className="sg-slash"
        style={{
          position: "absolute",
          top: "-15%", bottom: "-15%",
          left: "68%",
          width: "min(24vw, 380px)",
          transform: "skewX(-14deg)",
          background: `linear-gradient(180deg,
            transparent 0%,
            ${SG_TEAL}10 12%,
            ${SG_TEAL}30 30%,
            rgba(255,255,255,0.14) 50%,
            ${SG_TEAL}30 70%,
            ${SG_TEAL}10 88%,
            transparent 100%
          )`,
          filter: "blur(2px)",
          zIndex: 1,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0.7,
          willChange: "transform",
        }}
      />

      {/* ── Layer 2: Particle swarm — 60 circles along the J-curve.
         Reduced from the original 130, single drop-shadow per circle
         (was two), and no mix-blend-mode. Same atmosphere, ~70%
         cheaper to paint. ── */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          zIndex: 2, pointerEvents: "none",
          opacity: 0.7,
        }}
      >
        {PARTICLES.map((p, i) => {
          const style: React.CSSProperties & Record<string, string> = {
            filter: `drop-shadow(0 0 ${(p.r * 3).toFixed(2)}px ${p.color})`,
            animation: `sg-particle-float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            transformOrigin: `${p.cx}px ${p.cy}px`,
            "--sg-drift": `${(p.drift * 0.18).toFixed(2)}px`,
          };
          return (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={round4(p.r * 0.22)}
              fill={p.color}
              opacity={p.opacity}
              style={style}
            />
          );
        })}
      </svg>

      {/* ── Layer 3: Industrial wireframe grid — whisper ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 2,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "clamp(60px, 7vw, 96px) clamp(60px, 7vw, 96px)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.6) 20%, transparent 85%)",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.6) 20%, transparent 85%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 4: Central bloom behind the headline ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "42%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(85%, 1000px)", height: "55%",
          background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${SG_ORANGE}1c 0%, ${SG_TEAL}10 35%, transparent 72%)`,
          zIndex: 2, pointerEvents: "none",
          filter: "blur(22px)",
        }}
      />

      {/* ── Layer 5: Readability vignettes ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.18) 22%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.88) 100%)`, zIndex: 3, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 100% at 50% 50%, transparent 38%, rgba(0,0,0,0.55) 100%)`, zIndex: 3, pointerEvents: "none" }} />

      {/* Cursor-follow spotlight REMOVED — see top of HeroSection for rationale. */}

      {/* ── GHOST EMBLEM: massive "4+" outline behind everything (signature) ── */}
      <div
        aria-hidden
        className="sg-emblem"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(110vw, 1600px)",
          textAlign: "center",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <span style={{
          display: "block",
          fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
          fontSize: "clamp(90px, 24vw, 480px)",
          fontWeight: 800,
          lineHeight: 0.85,
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: `1px ${SG_ORANGE}26`,
          textShadow: `0 0 80px ${SG_ORANGE}10`,
        }}>
          4<span style={{ color: "transparent", WebkitTextStroke: `1px ${SG_TEAL}26` }}>+</span>
        </span>
        <span style={{
          display: "block",
          marginTop: "clamp(-30px, -2vh, -20px)",
          fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
          fontSize: "clamp(11px, 0.9vw, 14px)",
          fontWeight: 600,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.12)",
        }}>
          Mozaic · Next Era
        </span>
      </div>

      {/* ── Content — asymmetric editorial composition ── */}
      <div className="sg-hero-grid" style={{
        maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 4.5vw, 72px)",
        position: "relative", zIndex: 4,
        width: "100%",
        display: "flex", flexDirection: "column",
        gap: "clamp(22px, 4vh, 48px)",
      }}>
        {/* ─── TOP ROW: kicker pill LEFT, date marker RIGHT ─────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap",
        }}>
          {/* Kicker pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 14px 8px 12px", borderRadius: 999,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}>
            <span className="sg-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: SG_ORANGE, boxShadow: `0 0 12px ${SG_ORANGE}80` }} />
            <span style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 600,
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.78)",
            }}>
              Executive Roundtable · Invite-Only
            </span>
          </div>

          {/* Date marker RIGHT */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(10px, 0.85vw, 12px)",
            fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}>
            <span style={{ width: 24, height: 1, background: `linear-gradient(90deg, transparent, ${SG_ORANGE})` }} />
            <span>Dubai</span>
            <span style={{ color: SG_ORANGE, opacity: 0.7 }}>·</span>
            <span style={{ color: SG_WHITE }}>11 June 2026</span>
          </div>
        </div>

        {/* ─── MAIN SPLIT: stacked headline LEFT · pullquote RIGHT ─────── */}
        <div className="sg-hero-split" style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
        }}>
          {/* LEFT: stacked uppercase display title */}
          <h1 style={{
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(26px, 5.4vw, 76px)",
            fontWeight: 700,
            color: SG_WHITE,
            letterSpacing: "-0.034em",
            lineHeight: 0.96,
            margin: 0,
            textAlign: "left",
            textTransform: "uppercase",
            overflowWrap: "break-word",
            hyphens: "auto",
          }}>
            <span className="sg-h1-word sg-h1-word-1" style={{ display: "block" }}>Powering</span>
            <span className="sg-h1-word sg-h1-word-2" style={{ display: "block" }}>the future of</span>
            <span className="sg-h1-word sg-h1-word-3" style={{ display: "block", color: SG_ORANGE }}>mass capacity</span>
            <span className="sg-h1-word sg-h1-word-4" style={{ display: "block" }}>storage.</span>
          </h1>

          {/* RIGHT: editorial pullquote — REAL italic via serif fallback */}
          <div
            className="sg-hero-pullquote sg-hero-reveal sg-hero-reveal-pullquote"
            style={{
              position: "relative",
              paddingLeft: "clamp(22px, 2.4vw, 36px)",
              paddingRight: "clamp(16px, 2vw, 24px)",
              paddingBlock: "clamp(8px, 1.4vh, 14px)",
            }}
          >
            {/* Soft reading-surface — solid radial wash (backdrop-filter
               removed; was forcing per-frame compositor re-rasterization
               whenever the mesh-gradient underneath changed). */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: "-6% -8% -6% -2%",
                background: `radial-gradient(ellipse 80% 90% at 35% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.0) 85%)`,
                borderRadius: 12,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Vertical green accent line */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0, top: "6%", bottom: "6%",
                width: 2,
                background: `linear-gradient(180deg, transparent 0%, ${SG_ORANGE}aa 18%, ${SG_ORANGE} 50%, ${SG_ORANGE}aa 82%, transparent 100%)`,
                boxShadow: `0 0 18px ${SG_ORANGE}55`,
                borderRadius: 2,
                zIndex: 1,
              }}
            />

            {/* Editorial pullquote — REAL italic from a serif typeface (Söhne Breit has no italic) */}
            <p style={{
              position: "relative",
              zIndex: 1,
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(24px, 3vw, 44px)",
              lineHeight: 1.18,
              letterSpacing: "-0.012em",
              color: "#FFFFFF",
              margin: 0,
              textWrap: "balance" as "balance",
              maxWidth: 540,
              textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 18px rgba(0,0,0,0.55)",
            }}>
              The data centre of tomorrow, <span style={{ color: SG_GREEN_BRIGHT, fontStyle: "italic", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 14px rgba(0,0,0,0.6)" }}>in one room.</span>
            </p>

            {/* Supporting paragraph — Söhne Breit */}
            <p style={{
              position: "relative",
              zIndex: 1,
              marginTop: "clamp(18px, 2.4vh, 26px)",
              marginBottom: 0,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(13px, 1.1vw, 15.5px)",
              fontWeight: 400,
              lineHeight: 1.65,
              letterSpacing: "0.005em",
              color: "rgba(255,255,255,0.78)",
              maxWidth: 500,
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              textWrap: "pretty" as "pretty",
            }}>
              An invitation-only Seagate Technology roundtable on Mozaic 4+, higher density, and a 40% energy cut versus conventional drives.
            </p>
          </div>
        </div>

        {/* ─── BOTTOM EDITORIAL STRIP: meta LEFT, countdown RIGHT ──────── */}
        <div className="sg-hero-bottom" style={{
          position: "relative",
          marginTop: "clamp(8px, 1.5vh, 16px)",
          padding: "clamp(16px, 2vh, 24px) 0 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "clamp(20px, 3vw, 40px)", flexWrap: "wrap",
        }}>
          {/* Top rule */}
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 15%, ${SG_ORANGE}55 50%, rgba(255,255,255,0.08) 85%, transparent 100%)` }} />

          {/* LEFT: inline meta facts */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: "clamp(14px, 1.8vw, 24px)",
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(11px, 0.95vw, 13.5px)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.78)",
            letterSpacing: "0.01em",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: SG_ORANGE, boxShadow: `0 0 8px ${SG_ORANGE}` }} />
              10:30 – 13:35 GST
            </span>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
            <span>Dubai, UAE</span>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>In-Person · Invite-Only</span>
          </div>

          {/* RIGHT: compact countdown */}
          <CountdownDisplay target={EVENT_TARGET} />
        </div>
      </div>

      <style jsx global>{`
        /* ── Hero reveal: pure-CSS, falls back to visible if animation fails ──
           Each element's NATURAL state is the visible end-state. The animation
           only specifies the FROM keyframe — if the browser fails to run the
           animation (WebKit composite-layer issues, etc.), the element renders
           at its declared style which is the visible end-state. */
        @keyframes sg-hero-fade-up {
          from { opacity: 0; transform: translateY(28px); }
        }
        @keyframes sg-hero-fade-up-small {
          from { opacity: 0; transform: translateY(14px); }
        }
        .sg-h1-word { animation: sg-hero-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .sg-h1-word-1 { animation-delay: 0.15s; }
        .sg-h1-word-2 { animation-delay: 0.28s; }
        .sg-h1-word-3 { animation-delay: 0.42s; }
        .sg-h1-word-4 { animation-delay: 0.55s; }
        .sg-hero-reveal-pullquote {
          animation: sg-hero-fade-up-small 1.1s 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .sg-h1-word, .sg-hero-reveal-pullquote {
            animation: none !important;
          }
        }

        /* Particle drift along J-curve */
        @keyframes sg-particle-float {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(var(--sg-drift, 0px), -8px); }
        }

        /* Kicker pulse dot */
        @keyframes sg-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${SG_ORANGE}80, 0 0 10px ${SG_ORANGE}80; }
          50% { box-shadow: 0 0 0 7px ${SG_ORANGE}00, 0 0 16px ${SG_ORANGE}cc; }
        }
        .sg-pulse-dot { animation: sg-pulse 2.6s ease-in-out infinite; }

        /* Ghost "4+" emblem subtle breath */
        @keyframes sg-emblem-breath {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.022); }
        }
        .sg-emblem { animation: sg-emblem-breath 10s ease-in-out infinite; }

        /* Responsive: stack the split on narrow screens */
        @media (max-width: 880px) {
          .sg-hero-split {
            grid-template-columns: 1fr !important;
            gap: clamp(20px, 3vh, 32px) !important;
          }
        }

        /* Tablet portrait & smaller — tighter typography, dial back emblem */
        @media (max-width: 720px) {
          .sg-emblem {
            opacity: 0.55 !important;
          }
          .sg-hero-pullquote {
            padding-left: clamp(14px, 3vw, 22px) !important;
          }
        }

        /* Mobile — tighter top row, stack bottom strip */
        @media (max-width: 620px) {
          .sg-hero-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
        }

        /* Small mobile — hide emblem (would compete with stacked content), tighten nav */
        @media (max-width: 480px) {
          .sg-emblem {
            display: none !important;
          }
          .sg-nav-cta {
            font-size: 11px !important;
            padding: 8px 12px !important;
          }
        }

        /* Tiny screens — minimum viable layout */
        @media (max-width: 360px) {
          .sg-nav-cta {
            font-size: 0 !important;
            width: 36px !important; height: 36px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            position: relative !important;
          }
          .sg-nav-cta::after {
            content: "→";
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #fff;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-pulse-dot, .sg-emblem { animation: none !important; }
          circle[style*="sg-particle-float"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Statement Section — parallax background + word-reveal (SonicWall-style) ─
const OVERVIEW_WORDS = "Reliable storage, built for the era of mass capacity.".split(" ");

function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Reveal timeline — fires when section enters viewport.
  // Dropped expensive filter:blur and clip-path animations — both forced
  // per-frame compositor work and were among the heaviest paints on the
  // page. Replaced with opacity + translateY which the browser can keep
  // on a GPU layer without re-rasterizing.
  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header — dashes draw in + kicker fades up
    if (headerRef.current) {
      const dashes = headerRef.current.querySelectorAll(".sg-ov-dash");
      const kicker = headerRef.current.querySelector(".sg-ov-kicker");
      tl.fromTo(dashes, { scaleX: 0 }, { scaleX: 1, duration: 0.55, stagger: 0.05 }, 0)
        .fromTo(kicker, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
    }

    // Heading — word-by-word opacity + y reveal (no filter:blur)
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll(".sg-reveal-word");
      tl.fromTo(
        words,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power2.out" },
        0.2
      );
    }

    // Gradient divider grows from center
    if (headerRef.current) {
      const divider = headerRef.current.querySelector(".sg-ov-divider");
      if (divider) tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: "center" }, 0.7);
    }

    // Body paragraphs — opacity + y stagger (no clip-path)
    if (bodyRef.current) {
      const paras = bodyRef.current.querySelectorAll(".sg-ov-para");
      const callout = bodyRef.current.querySelector(".sg-ov-callout");
      tl.fromTo(
        paras,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 },
        0.8
      );
      if (callout) tl.fromTo(callout, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.15);
    }
  }, [inView]);

  // Scroll-linked background parallax REMOVED.
  // The fromTo({ yPercent: 12, scale: 1.08 } → { yPercent: -12, scale: 1 })
  // with scrub: 1 on a huge background image was the primary cause of the
  // mid-page glitch — every scroll tick re-transformed an 1800×1100 PNG
  // and forced the section to re-rasterize. Background is now static.

  return (
    <section ref={sectionRef} id="overview" style={{
      background: SG_BONE,
      minHeight: "72svh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "clamp(40px, 5vh, 64px) 0 clamp(24px, 3vh, 40px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background image — HUGE, anchored slightly below center (wrapper handles positioning, img handles parallax) */}
      <div aria-hidden style={{
        position: "absolute",
        top: "62%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(140vw, 1800px)",
        height: "min(140%, 1100px)",
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <Image
          src="https://efg-final.s3.eu-north-1.amazonaws.com/logos/seagate_bg.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 90vw"
          style={{
            objectFit: "contain",
            objectPosition: "center center",
          }}
        />
      </div>

      {/* Solid readability wash behind the text — no filter:blur (image
         itself is already blurred + dimmed above). Just a soft bone-tinted
         radial that keeps the headline + body crisp. */}
      <div aria-hidden style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(95%, 1080px)",
        height: "min(82%, 640px)",
        background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${SG_BONE} 0%, ${SG_BONE}f0 35%, ${SG_BONE}b8 60%, ${SG_BONE}60 78%, transparent 92%)`,
        zIndex: 1,
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 860, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 56px)",
        position: "relative", zIndex: 3,
        textAlign: "center",
      }}>
        {/* Header — dashes flank kicker */}
        <div ref={headerRef} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: "center" }}>
            <div className="sg-ov-dash" style={{
              width: 32, height: 2,
              background: SG_ORANGE,
              borderRadius: 1,
              transform: "scaleX(0)",
              transformOrigin: "right center",
            }} />
            <span className="sg-ov-kicker" style={{
              display: "inline-flex", alignItems: "center",
              padding: "7px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.62)",
              border: "1px solid rgba(10,14,18,0.06)",
              backdropFilter: "blur(14px) saturate(1.3)",
              WebkitBackdropFilter: "blur(14px) saturate(1.3)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75), 0 1px 2px rgba(10,14,18,0.04), 0 6px 18px rgba(10,14,18,0.05)",
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 11, fontWeight: 600,
              letterSpacing: "0.36em", textTransform: "uppercase",
              color: SG_ORANGE,
              opacity: 0,
            }}>
              The Conversation
            </span>
            <div className="sg-ov-dash" style={{
              width: 32, height: 2,
              background: SG_ORANGE,
              borderRadius: 1,
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }} />
          </div>

          {/* Heading — word-by-word blur reveal */}
          <div ref={headingRef} style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 clamp(8px, 1vw, 14px)",
            marginBottom: 22,
          }}>
            {OVERVIEW_WORDS.map((word, i) => (
              <span key={i} className="sg-reveal-word" style={{
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 600,
                letterSpacing: "-0.026em",
                lineHeight: 1.1,
                color: SG_NAVY,
                display: "inline-block",
                opacity: 0,
              }}>
                {word}
              </span>
            ))}
          </div>

          {/* Gradient divider — grows from center */}
          <div className="sg-ov-divider" style={{
            width: 56, height: 2,
            background: `linear-gradient(90deg, ${SG_ORANGE}, ${SG_GREEN_BRIGHT})`,
            borderRadius: 1,
            margin: "0 auto",
            transform: "scaleX(0)",
          }} />
        </div>

        {/* Body — clip-path reveal paragraphs */}
        <div ref={bodyRef} style={{ maxWidth: 720, margin: "0 auto" }}>
          <p className="sg-ov-para" style={{
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.15vw, 16.5px)",
            fontWeight: 400,
            color: SG_GRAY_DEEP,
            lineHeight: 1.75,
            margin: "0 0 14px",
            opacity: 0,
            letterSpacing: "-0.003em",
          }}>
            Seagate offers the most reliable data storage solutions in the world — high-capacity drives that consume{" "}
            <span style={{
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic",
              fontWeight: 500,
              color: SG_NAVY,
              fontSize: "1.06em",
            }}>
              40% less energy
            </span>
            {" "}than conventional alternatives.
          </p>
          <p className="sg-ov-para" style={{
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.15vw, 16.5px)",
            fontWeight: 400,
            color: SG_GRAY_DEEP,
            lineHeight: 1.75,
            margin: "0 0 32px",
            opacity: 0,
            letterSpacing: "-0.003em",
          }}>
            More data in a single drive. Better efficiency. Built for the era of mass capacity.
          </p>

          {/* Liquid-glass callout — Mozaic 4+ */}
          <div className="sg-ov-callout" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "13px 26px", borderRadius: 999,
            background: "linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(240,238,232,0.45) 50%, rgba(255,235,210,0.35) 100%)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            opacity: 0,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: SG_ORANGE,
              boxShadow: `0 0 6px ${SG_ORANGE}80, 0 0 12px ${SG_ORANGE}30`,
              animation: "sgCalloutPulse 2.4s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              color: SG_NAVY, letterSpacing: "0.005em",
            }}>
              Featuring a Mozaic 4+ Technology Deep-Dive
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sgCalloutPulse {
          0%, 100% { box-shadow: 0 0 6px ${SG_ORANGE}80, 0 0 12px ${SG_ORANGE}30; }
          50% { box-shadow: 0 0 9px ${SG_ORANGE}aa, 0 0 18px ${SG_ORANGE}50; }
        }
      `}</style>
    </section>
  );
}

// ─── Takeaways Section ──────────────────────────────────────────────────────
function TakeawaysSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="takeaways" style={{
      background: SG_WHITE,
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 72px)",
        position: "relative", width: "100%",
      }}>
        {/* Single confident headline — left-aligned */}
        <h2 style={{
          fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
          fontSize: "clamp(24px, 3.4vw, 46px)",
          fontWeight: 600,
          letterSpacing: "-0.034em",
          lineHeight: 1.06,
          color: SG_NAVY,
          margin: 0,
          maxWidth: 680,
          textWrap: "balance" as "balance",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)",
        }}>
          Three ideas you&apos;ll take{" "}
          <span style={{
            fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
            fontStyle: "italic",
            fontWeight: 400,
            color: SG_ORANGE,
            letterSpacing: "-0.022em",
          }}>
            from the room.
          </span>
        </h2>

        {/* Editorial numbered list — tight rows, hairline dividers */}
        <ol style={{
          listStyle: "none",
          margin: "clamp(20px, 3vh, 36px) 0 0",
          padding: 0,
          borderTop: `1px solid rgba(10,14,18,0.12)`,
        }}>
          {TAKEAWAYS.map((t, i) => (
            <li
              key={t.n}
              className="sg-takeaway-row"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "minmax(80px, 0.75fr) 4fr",
                gap: "clamp(16px, 2.4vw, 40px)",
                alignItems: "baseline",
                padding: "clamp(14px, 2.2vh, 24px) 0",
                borderBottom: `1px solid rgba(10,14,18,0.12)`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.9s ${0.25 + i * 0.12}s cubic-bezier(0.22,1,0.36,1), transform 0.9s ${0.25 + i * 0.12}s cubic-bezier(0.22,1,0.36,1)`,
              }}
            >
              {/* Hover sweep */}
              <span aria-hidden className="sg-takeaway-sweep" style={{
                position: "absolute",
                left: 0, right: 0, bottom: -1,
                height: 1,
                background: SG_ORANGE,
                transform: "scaleX(0)",
                transformOrigin: "left center",
                transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              }} />

              {/* LEFT — Light-weight numeral */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(36px, 4vw, 64px)",
                  fontWeight: 200,
                  color: SG_NAVY,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.92,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(16px, 1.8vw, 26px)",
                  fontWeight: 200,
                  color: SG_ORANGE,
                  lineHeight: 1,
                }}>
                  /
                </span>
              </div>

              {/* RIGHT — heading + description */}
              <div style={{ paddingTop: "clamp(2px, 0.4vh, 4px)" }}>
                <h3 style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(15px, 1.7vw, 22px)",
                  fontWeight: 600,
                  color: SG_NAVY,
                  letterSpacing: "-0.024em",
                  lineHeight: 1.16,
                  margin: "0 0 clamp(4px, 0.8vh, 8px)",
                  textWrap: "balance" as "balance",
                }}>
                  {t.heading}
                </h3>
                <p style={{
                  margin: 0,
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(12.5px, 0.95vw, 14.5px)",
                  fontWeight: 400,
                  color: SG_GRAY_DEEP,
                  lineHeight: 1.55,
                  letterSpacing: "-0.003em",
                  maxWidth: 620,
                }}>
                  {t.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <style jsx global>{`
        .sg-takeaway-row:hover .sg-takeaway-sweep {
          transform: scaleX(1) !important;
        }
        @media (max-width: 760px) {
          .sg-takeaway-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Speakers Section ───────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="speakers" style={{
      background: SG_BONE,
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 72px)",
        position: "relative", width: "100%",
      }}>
        {/* Editorial section header — magazine masthead style */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap",
          marginBottom: "clamp(24px, 3.5vh, 40px)",
          paddingBottom: "clamp(16px, 2vh, 24px)",
          position: "relative",
        }}>
          {/* Gradient hairline divider — fades at edges for premium feel */}
          <div aria-hidden style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(10,14,18,0.18) 20%, rgba(10,14,18,0.22) 50%, rgba(10,14,18,0.18) 80%, transparent 100%)",
            transform: inView ? "scaleX(1)" : "scaleX(0.4)",
            transformOrigin: "center",
            opacity: inView ? 1 : 0,
            transition: "transform 1.4s 0.2s cubic-bezier(0.22,1,0.36,1), opacity 1.4s 0.2s ease",
          }} />
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Section title */}
            <h2 style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.034em",
              lineHeight: 0.98,
              color: SG_NAVY,
              margin: 0,
              textTransform: "uppercase",
            }}>
              At the table.
            </h2>
          </div>

          {/* Right-aligned meta */}
          <div style={{
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: 10.5, fontWeight: 500,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(10,14,18,0.5)",
            display: "inline-flex", alignItems: "center", gap: 12,
            opacity: inView ? 1 : 0,
            transition: "opacity 1.2s 0.15s ease",
          }}>
            <span>Four perspectives · One conversation</span>
          </div>
        </div>

        {/* Portrait grid — luxury magazine spread */}
        <div className="sg-speaker-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(14px, 1.8vw, 28px)",
          margin: "0 auto",
        }}>
          {SPEAKERS.map((s, i) => {
            const isModerator = s.role === "Moderator";
            return (
              <a
                key={s.name}
                href={s.linkedin || "#"}
                target={s.linkedin ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="sg-speaker-card"
                style={{
                  display: "block", textDecoration: "none",
                  position: "relative",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 1.1s ${0.25 + i * 0.12}s cubic-bezier(0.22,1,0.36,1), transform 1.1s ${0.25 + i * 0.12}s cubic-bezier(0.22,1,0.36,1)`,
                }}
              >
                {/* Portrait — 4:5 magazine ratio */}
                <div className="sg-speaker-photo-wrap" style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  overflow: "hidden",
                  borderRadius: 4,
                  background: `linear-gradient(165deg, ${SG_NAVY} 0%, ${SG_NAVY_DEEP} 100%)`,
                  boxShadow: "0 1px 2px rgba(10,14,18,0.06), 0 8px 24px rgba(10,14,18,0.07)",
                  transition: "box-shadow 0.7s cubic-bezier(0.22,1,0.36,1)",
                }}>
                  <Image
                    src={s.photo}
                    alt={s.name}
                    className="sg-speaker-photo"
                    fill
                    sizes="(max-width: 760px) 280px, 310px"
                    style={{
                      objectFit: "cover", objectPosition: "center 18%",
                      transform: inView ? `scale(${s.photoZoom ?? 1})` : `scale(${(s.photoZoom ?? 1) * 1.08})`,
                      transition: `transform 1.8s ${0.3 + i * 0.12}s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease`,
                    }}
                  />

                  {/* Inner hairline ring — almost imperceptible, adds finish */}
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    borderRadius: 4,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
                    pointerEvents: "none",
                  }} />

                  {/* Soft bottom gradient — for caption legibility */}
                  <div aria-hidden style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, height: "45%",
                    background: `linear-gradient(180deg, transparent 0%, rgba(5,7,10,0.05) 30%, rgba(5,7,10,0.55) 100%)`,
                    pointerEvents: "none",
                  }} />

                  {/* Role label — bottom-left over photo */}
                  <div style={{
                    position: "absolute", left: "clamp(14px, 1.4vw, 20px)", bottom: "clamp(14px, 1.4vw, 20px)",
                    display: "inline-flex", alignItems: "center", gap: 8,
                  }}>
                    <span aria-hidden style={{
                      width: 18, height: 1,
                      background: isModerator ? SG_ORANGE : "rgba(255,255,255,0.6)",
                    }} />
                    <span style={{
                      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                      fontSize: 9.5, fontWeight: 600,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: isModerator ? SG_ORANGE : SG_WHITE,
                    }}>
                      {s.role}
                    </span>
                  </div>

                  {/* LinkedIn arrow — top-right, appears on hover */}
                  <div className="sg-speaker-link" style={{
                    position: "absolute", top: 14, right: 14,
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.16)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0,
                    transform: "translate(-4px, 4px)",
                    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), background 0.3s ease",
                  }}>
                    <span style={{ color: SG_WHITE, fontSize: 14, lineHeight: 1, transform: "translate(0px, -1px)" }}>↗</span>
                  </div>
                </div>

                {/* Caption block below portrait */}
                <div style={{
                  paddingTop: "clamp(14px, 2vh, 20px)",
                }}>
                  <h3 className="sg-speaker-name" style={{
                    margin: 0,
                    fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                    fontSize: "clamp(15px, 1.2vw, 17px)",
                    fontWeight: 600,
                    color: SG_NAVY,
                    letterSpacing: "-0.024em",
                    lineHeight: 1.12,
                    display: "inline-block",
                    position: "relative",
                  }}>
                    {s.name}
                    {/* Animated underline — sweeps in on card hover */}
                    <span aria-hidden className="sg-speaker-underline" style={{
                      position: "absolute", left: 0, bottom: -4, height: 1,
                      width: 0,
                      background: SG_ORANGE,
                      transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }} />
                  </h3>
                  <p style={{
                    margin: "clamp(4px, 0.6vh, 6px) 0 2px",
                    fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                    fontSize: "clamp(10px, 0.72vw, 11px)",
                    fontWeight: 500,
                    color: SG_NAVY,
                    lineHeight: 1.4,
                    letterSpacing: "-0.005em",
                    maxWidth: 280,
                  }}>
                    {s.title}
                  </p>
                  <p style={{
                    margin: 0,
                    fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: "clamp(10px, 0.72vw, 11px)",
                    color: SG_GRAY,
                    lineHeight: 1.4,
                  }}>
                    {s.org}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .sg-speaker-card:hover .sg-speaker-photo {
          transform: scale(1.04) !important;
          filter: brightness(1.04) saturate(1.05);
        }
        .sg-speaker-card:hover .sg-speaker-photo-wrap {
          box-shadow:
            0 2px 4px rgba(10, 14, 18, 0.08),
            0 24px 48px rgba(10, 14, 18, 0.16) !important;
        }
        .sg-speaker-card:hover .sg-speaker-link {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
          background: ${SG_ORANGE} !important;
          border-color: ${SG_ORANGE} !important;
        }
        .sg-speaker-card:hover .sg-speaker-underline {
          width: 32px !important;
        }
        @media (max-width: 1024px) {
          .sg-speaker-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            max-width: 620px !important;
          }
        }
        @media (max-width: 560px) {
          .sg-speaker-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(20px, 4vw, 28px) !important;
            max-width: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Agenda Section ─────────────────────────────────────────────────────────
function AgendaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="agenda" style={{
      background: SG_WHITE,
      padding: "clamp(64px, 8vh, 96px) 0",
      borderTop: `1px solid ${SG_HAIRLINE}`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", position: "relative" }}>

        {/* Editorial header — kicker + heading + italic subtitle (left) | date/venue meta (right) */}
        <div className="sg-agenda-header" style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 32, flexWrap: "wrap",
          marginBottom: "clamp(28px, 4vh, 44px)",
          paddingBottom: "clamp(20px, 2.5vh, 28px)",
          position: "relative",
        }}>
          {/* Gradient hairline divider — matches Speakers section */}
          <div aria-hidden style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(10,14,18,0.18) 15%, rgba(10,14,18,0.22) 50%, rgba(10,14,18,0.18) 85%, transparent 100%)",
            transform: inView ? "scaleX(1)" : "scaleX(0.4)",
            transformOrigin: "center",
            opacity: inView ? 1 : 0,
            transition: "transform 1.4s 0.2s cubic-bezier(0.22,1,0.36,1), opacity 1.4s 0.2s ease",
          }} />

          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
            maxWidth: 640,
          }}>
            <span style={{
              display: "block", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase",
              color: SG_ORANGE, marginBottom: 14,
            }}>Agenda</span>
            <h2 style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 600,
              letterSpacing: "-0.028em", lineHeight: 1.04,
              color: SG_NAVY, margin: 0,
            }}>
              How the day unfolds.
            </h2>
            <p style={{
              margin: "clamp(10px, 1.4vh, 14px) 0 0",
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(13px, 1vw, 14.5px)",
              color: SG_GRAY,
              lineHeight: 1.5,
            }}>
              Four hours, one table.
            </p>
          </div>

          {/* Right meta — date · venue */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: 10.5, fontWeight: 500,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(10,14,18,0.5)",
            opacity: inView ? 1 : 0,
            transition: "opacity 1.2s 0.25s ease",
          }}>
            <span>11 Jun 2026</span>
            <span aria-hidden style={{ width: 18, height: 1, background: "rgba(10,14,18,0.2)" }} />
            <span>Dubai</span>
          </div>
        </div>

        {/* Rows */}
        <div className="sg-agenda">
          {AGENDA.map((item, i) => {
            const isFeature = item.type === "feature";
            const isBreak = item.type === "break";
            return (
              <div key={i} className={`sg-agenda-row${isFeature ? " is-feature" : ""}${isBreak ? " is-break" : ""}`} style={{
                display: "grid",
                gridTemplateColumns: "2px 170px 1fr 200px",
                gap: "clamp(14px, 2vw, 32px)",
                alignItems: "stretch",
                padding: "clamp(12px, 1.6vh, 18px) clamp(8px, 1vw, 14px)",
                borderBottom: `1px solid ${SG_HAIRLINE}`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.05}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.05}s, background 0.35s ease`,
                position: "relative",
              }}>
                {/* Left marker — orange for feature, hairline for neutral, transparent for break */}
                <div aria-hidden className="sg-agenda-marker" style={{
                  alignSelf: "stretch",
                  background: isFeature ? SG_ORANGE : isBreak ? "transparent" : "rgba(10,14,18,0.10)",
                  borderRadius: 1,
                }} />

                {/* Time block */}
                <div className="sg-agenda-time" style={{ paddingTop: 2 }}>
                  <span className="sg-agenda-time-main" style={{
                    fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                    fontSize: "clamp(17px, 1.4vw, 20px)", fontWeight: 600,
                    color: isBreak ? SG_GRAY : SG_NAVY,
                    fontVariantNumeric: "tabular-nums", letterSpacing: "-0.012em",
                    transition: "color 0.3s ease",
                  }}>
                    {item.start}
                    {item.end !== "—" && <span style={{ color: SG_GRAY, fontWeight: 400 }}> – {item.end}</span>}
                  </span>
                  <span style={{
                    display: "block", marginTop: 5,
                    fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
                    color: "rgba(10,14,18,0.42)",
                  }}>
                    {item.duration}
                  </span>
                </div>

                {/* Segment block */}
                <div className="sg-agenda-segment" style={{ paddingTop: 2 }}>
                  <h3 style={{
                    margin: 0,
                    fontFamily: isBreak
                      ? `Georgia, "Cambria", "Times New Roman", serif`
                      : "var(--font-sohne-breit), system-ui, sans-serif",
                    fontStyle: isBreak ? "italic" : "normal",
                    fontSize: isFeature ? "clamp(17px, 1.5vw, 21px)" : "clamp(15px, 1.3vw, 18px)",
                    fontWeight: isFeature ? 600 : isBreak ? 400 : 500,
                    color: isBreak ? SG_GRAY_DEEP : SG_NAVY,
                    letterSpacing: "-0.018em", lineHeight: 1.28,
                  }}>
                    {item.segment}
                  </h3>
                  {isFeature && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      marginTop: 8,
                      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                      fontSize: 9.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase",
                      color: SG_ORANGE,
                    }}>
                      <span aria-hidden style={{ width: 14, height: 1, background: SG_ORANGE }} />
                      Featured
                    </span>
                  )}
                </div>

                {/* Owner */}
                <div className="sg-agenda-owner" style={{ textAlign: "right", paddingTop: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                    fontSize: "clamp(11.5px, 0.95vw, 13px)", fontWeight: 400,
                    color: isBreak ? SG_GRAY : SG_GRAY_DEEP,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.4,
                  }}>
                    {item.owner}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing footnote — italic Georgia, gentle */}
        <p style={{
          margin: "clamp(22px, 3vh, 32px) 0 0",
          fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
          fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(11.5px, 0.9vw, 12.5px)",
          color: "rgba(10,14,18,0.4)",
          textAlign: "center",
          letterSpacing: "0.005em",
          opacity: inView ? 1 : 0,
          transition: "opacity 1.4s 0.8s ease",
        }}>
          Programme subject to refinement.
        </p>
      </div>

      <style jsx global>{`
        .sg-agenda-row:hover {
          background: rgba(113, 181, 63, 0.025);
        }
        .sg-agenda-row.is-feature:hover {
          background: rgba(113, 181, 63, 0.05);
        }
        .sg-agenda-row:hover .sg-agenda-time-main {
          color: ${SG_ORANGE} !important;
        }
        @media (max-width: 760px) {
          .sg-agenda-row {
            grid-template-columns: 2px 1fr !important;
            row-gap: 6px !important;
            column-gap: 14px !important;
            padding: clamp(11px, 2.4vw, 14px) clamp(6px, 1vw, 10px) !important;
          }
          .sg-agenda-time, .sg-agenda-segment {
            grid-column: 2 !important;
          }
          .sg-agenda-owner {
            grid-column: 2 !important;
            text-align: left !important;
            margin-top: 2px;
          }
          .sg-agenda-header {
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── About Seagate Section ──────────────────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="about" style={{
      background: `linear-gradient(180deg, ${SG_BLACK} 0%, ${SG_NAVY} 55%, ${SG_NAVY_DEEP} 100%)`,
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient lime halo — behind the right image */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", right: "-5%",
        transform: "translateY(-50%)",
        width: "55%", height: "75%",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${SG_ORANGE}1c 0%, ${SG_TEAL}0d 35%, transparent 70%)`,
        pointerEvents: "none",
        filter: "blur(60px)",
      }} />
      {/* Subtle counter-glow bottom-left */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 40% at 0% 100%, ${SG_ORANGE}06 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", position: "relative", zIndex: 2 }}>
        <div className="sg-about-grid" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: "clamp(36px, 5vw, 80px)",
          alignItems: "center",
        }}>
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <Image
              src={LOGO_2C_NEG}
              alt="Seagate"
              width={480}
              height={96}
              style={{
                height: "clamp(64px, 6.8vw, 96px)", width: "auto",
                marginBottom: "clamp(26px, 3vw, 38px)",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              }}
            />

            <span style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase",
              color: SG_ORANGE,
              marginBottom: 18,
            }}>
              <span aria-hidden style={{ width: 22, height: 1, background: SG_ORANGE }} />
              About Seagate
            </span>

            <h2 style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 600,
              letterSpacing: "-0.028em", lineHeight: 1.06,
              color: SG_WHITE, margin: 0, maxWidth: 560,
            }}>
              Storage that scales with the data you can&apos;t afford to lose.
            </h2>

            <p style={{
              margin: "clamp(14px, 1.8vh, 20px) 0 0",
              maxWidth: 520,
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(13.5px, 1.05vw, 15px)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.55,
            }}>
              Four decades of building the infrastructure beneath the data-driven world.
            </p>

            <p style={{
              marginTop: "clamp(20px, 2.4vh, 28px)",
              maxWidth: 540,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(13px, 1.05vw, 14.5px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.72,
              letterSpacing: "-0.003em",
            }}>
              From hyperscale data centres to the AI workloads reshaping every industry, Seagate&apos;s high-capacity drives power the world&apos;s most demanding storage. The Mozaic 4+ platform marks the next leap — more data per drive, dramatically lower energy consumption.
            </p>

            <a
              href="https://www.seagate.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="sg-about-cta"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                marginTop: "clamp(28px, 3.2vh, 38px)",
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
                color: SG_WHITE, textDecoration: "none",
                padding: "13px 22px", borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Visit Seagate.com
              <span aria-hidden className="sg-about-cta-arrow" style={{
                fontSize: 14, lineHeight: 1,
                display: "inline-block",
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}>↗</span>
            </a>
          </div>

          {/* RIGHT — brand image */}
          <div className="sg-about-visual" style={{
            position: "relative",
            opacity: inView ? 1 : 0,
            transform: inView ? "scale(1) translateY(0)" : "scale(0.96) translateY(20px)",
            transition: "opacity 1.4s 0.2s cubic-bezier(0.22,1,0.36,1), transform 1.4s 0.2s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Soft halo behind image */}
            <div aria-hidden style={{
              position: "absolute", inset: "-8%",
              background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${SG_ORANGE}22 0%, ${SG_TEAL}10 40%, transparent 75%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative",
              aspectRatio: "1 / 1",
              maxWidth: 720,
              margin: "0 auto",
              width: "100%",
              overflow: "visible",
            }}>
              <Image
                src="https://efg-final.s3.eu-north-1.amazonaws.com/logos/seagate_bg1.png"
                alt="Seagate brand visual"
                fill
                sizes="(max-width: 900px) 480px, 560px"
                style={{
                  objectFit: "contain", objectPosition: "center center",
                  transform: "scale(1.7)",
                  transformOrigin: "center center",
                  filter: "drop-shadow(0 24px 48px rgba(113, 181, 63, 0.18))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .sg-about-cta:hover {
          background: ${SG_ORANGE} !important;
          border-color: ${SG_ORANGE} !important;
          color: ${SG_BLACK} !important;
        }
        .sg-about-cta:hover .sg-about-cta-arrow {
          transform: translate(3px, -3px);
        }
        @media (max-width: 900px) {
          .sg-about-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(28px, 5vw, 48px) !important;
          }
          .sg-about-visual {
            max-width: 420px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Register Section ───────────────────────────────────────────────────────
function RegisterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const FEATURES = [
    "Invitation-only, executive audience",
    "Half-day roundtable + networking lunch",
    "Chatham House Rule",
  ];

  // Form state
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", company: "", jobTitle: "", message: "",
  });
  // Default to UAE (+971) since the event is in Dubai
  const uaeIndex = COUNTRY_CODES.findIndex((c) => c.country === "AE");
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES[uaeIndex >= 0 ? uaeIndex : 0]);
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
    if (phoneErr) { setPhoneError(phoneErr); return; }
    setLoading(true);
    const result = await submitForm({
      type: "attend",
      full_name: form.fullName,
      email: form.email,
      company: form.company,
      job_title: form.jobTitle,
      phone: `${country.code} ${form.phone}`,
      event_name: "Seagate Executive Roundtable — Dubai 2026",
      metadata: { message: form.message },
    });
    setLoading(false);
    if (result.success) setSubmitted(true);
    else setErrorMsg(result.error || "Something went wrong. Please try again.");
  };

  return (
    <section ref={ref} id="register" style={{
      background: SG_BONE,
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle ambient — lime kiss in top-right */}
      <div aria-hidden style={{
        position: "absolute", top: "-15%", right: "-10%",
        width: "55%", height: "75%",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${SG_ORANGE}10 0%, ${SG_TEAL}06 40%, transparent 75%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1240, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 72px)",
        position: "relative", zIndex: 2, width: "100%",
      }}>
        <div className="sg-register-grid" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.1fr)",
          gap: "clamp(40px, 5vw, 80px)",
          alignItems: "center",
        }}>
          {/* LEFT — Editorial copy */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase",
              color: SG_ORANGE,
              marginBottom: 18,
            }}>
              <span aria-hidden style={{ width: 22, height: 1, background: SG_ORANGE }} />
              Register
            </span>

            <h2 style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(32px, 4.4vw, 56px)", fontWeight: 600,
              letterSpacing: "-0.03em", lineHeight: 1.02,
              color: SG_NAVY, margin: 0, maxWidth: 480,
            }}>
              Reserve your seat.
            </h2>

            <p style={{
              margin: "clamp(14px, 1.8vh, 20px) 0 0",
              maxWidth: 480,
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(13.5px, 1.05vw, 15px)",
              color: SG_GRAY,
              lineHeight: 1.55,
            }}>
              An invitation-only conversation on the future of mass-capacity storage.
            </p>

            <p style={{
              marginTop: "clamp(20px, 2.4vh, 28px)",
              maxWidth: 480,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(13px, 1.05vw, 14.5px)",
              fontWeight: 400,
              color: SG_GRAY_DEEP,
              lineHeight: 1.72,
              letterSpacing: "-0.003em",
            }}>
              Submit your details below and our team will confirm your place within 24 hours. Seats are limited and confirmed on a rolling basis.
            </p>

            {/* Hairline divider — gradient fade, separates body from features */}
            <div aria-hidden style={{
              maxWidth: 280,
              height: 1,
              margin: "clamp(28px, 3.4vh, 38px) 0 clamp(20px, 2.4vh, 26px)",
              background: "linear-gradient(90deg, rgba(10,14,18,0.18) 0%, rgba(10,14,18,0.10) 60%, transparent 100%)",
              transform: inView ? "scaleX(1)" : "scaleX(0.4)",
              transformOrigin: "left",
              opacity: inView ? 1 : 0,
              transition: "transform 1.4s 0.3s cubic-bezier(0.22,1,0.36,1), opacity 1.4s 0.3s ease",
            }} />

            {/* Bulleted features */}
            <ul className="sg-register-features" style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex", flexDirection: "column", gap: "clamp(10px, 1.4vh, 14px)",
            }}>
              {FEATURES.map((feat, i) => (
                <li key={feat} className="sg-register-feat" style={{
                  display: "inline-flex", alignItems: "center", gap: 14,
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(13px, 1vw, 14px)",
                  fontWeight: 500,
                  color: SG_NAVY,
                  letterSpacing: "-0.005em",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(-8px)",
                  transition: `opacity 0.8s ${0.45 + i * 0.08}s cubic-bezier(0.22,1,0.36,1), transform 0.8s ${0.45 + i * 0.08}s cubic-bezier(0.22,1,0.36,1)`,
                }}>
                  <span aria-hidden className="sg-register-dot" style={{
                    position: "relative",
                    width: 10, height: 10, borderRadius: "50%",
                    flexShrink: 0,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${SG_ORANGE}40`,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: SG_ORANGE,
                      boxShadow: `0 0 8px ${SG_ORANGE}66`,
                    }} />
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Custom Seagate form */}
          <div className="sg-register-form" style={{
            background: `linear-gradient(180deg, ${SG_WHITE} 0%, #FAFAF7 100%)`,
            borderRadius: 20,
            padding: "clamp(28px, 3vw, 40px)",
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.9)",
              "0 1px 2px rgba(10,14,18,0.04)",
              "0 12px 32px rgba(10,14,18,0.06)",
              "0 32px 80px rgba(10,14,18,0.10)",
            ].join(", "),
            border: "1px solid rgba(10,14,18,0.06)",
            position: "relative",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s 0.15s cubic-bezier(0.22,1,0.36,1), transform 1s 0.15s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Top hairline accent — gradient lime fade, scales open on reveal */}
            <div aria-hidden style={{
              position: "absolute",
              top: 0, left: "8%", right: "8%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${SG_ORANGE}70 50%, transparent 100%)`,
              borderRadius: 1,
              transform: inView ? "scaleX(1)" : "scaleX(0.3)",
              transformOrigin: "center",
              opacity: inView ? 1 : 0,
              transition: "transform 1.6s 0.4s cubic-bezier(0.22,1,0.36,1), opacity 1.6s 0.4s ease",
            }} />

            {/* Bottom hairline accent — mirror of top, subtler */}
            <div aria-hidden style={{
              position: "absolute",
              bottom: 0, left: "20%", right: "20%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${SG_ORANGE}30 50%, transparent 100%)`,
              borderRadius: 1,
              transform: inView ? "scaleX(1)" : "scaleX(0.3)",
              transformOrigin: "center",
              opacity: inView ? 1 : 0,
              transition: "transform 1.6s 0.6s cubic-bezier(0.22,1,0.36,1), opacity 1.6s 0.6s ease",
            }} />

            {/* Editorial card header — eyebrow + gradient hairline */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12,
              paddingBottom: "clamp(16px, 1.8vh, 22px)",
              marginBottom: "clamp(20px, 2.4vh, 28px)",
              position: "relative",
            }}>
              {/* Gradient hairline divider — matches Speakers/Agenda */}
              <div aria-hidden style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: 1,
                background: "linear-gradient(90deg, transparent 0%, rgba(10,14,18,0.14) 20%, rgba(10,14,18,0.18) 50%, rgba(10,14,18,0.14) 80%, transparent 100%)",
              }} />

              <span style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase",
                color: SG_NAVY,
              }}>
                <span aria-hidden className="sg-live-dot" style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: SG_ORANGE,
                  boxShadow: `0 0 8px ${SG_ORANGE}80`,
                }} />
                Reservation
              </span>
              <span style={{
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: 9.5, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase",
                color: "rgba(10,14,18,0.42)",
              }}>
                ~ 60 sec
              </span>
            </div>
            {submitted ? (
              <div style={{
                padding: "clamp(20px, 4vw, 40px) 0",
                textAlign: "center",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: SG_ORANGE,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 18,
                  boxShadow: `0 8px 24px ${SG_ORANGE}40`,
                }}>
                  <span style={{ color: SG_WHITE, fontSize: 24, lineHeight: 1 }}>✓</span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 600,
                  color: SG_NAVY, margin: 0, letterSpacing: "-0.02em",
                }}>
                  Request received.
                </h3>
                <p style={{
                  margin: "10px 0 0",
                  fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                  fontStyle: "italic",
                  fontSize: 14, color: SG_GRAY, lineHeight: 1.55,
                }}>
                  Our team will confirm your seat within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="sg-form" noValidate>
                {/* Row 1: Name + Email */}
                <div className="sg-form-row">
                  <div className="sg-form-field">
                    <label htmlFor="sg-fullName">Full Name</label>
                    <input
                      id="sg-fullName" name="fullName" type="text" required
                      placeholder="Your full name"
                      value={form.fullName} onChange={handleChange} suppressHydrationWarning
                    />
                  </div>
                  <div className="sg-form-field">
                    <label htmlFor="sg-email">Work Email</label>
                    <input
                      id="sg-email" name="email" type="email" required
                      placeholder="you@company.com"
                      value={form.email} onChange={handleChange} suppressHydrationWarning
                    />
                  </div>
                </div>

                {/* Phone with country code */}
                <div className="sg-form-field" style={{ marginTop: 14 }}>
                  <label htmlFor="sg-phone">Phone Number</label>
                  <div className="sg-form-phone">
                    <select
                      aria-label="Country code"
                      suppressHydrationWarning
                      value={`${country.code}|${country.country}`}
                      onChange={(e) => {
                        const [code, c] = e.target.value.split("|");
                        const found = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === c);
                        if (found) { setCountry(found); setPhoneError(null); }
                      }}
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`}>
                          {cc.country} {cc.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="sg-phone" name="phone" type="tel" required
                      placeholder={country.placeholder}
                      maxLength={country.length}
                      value={form.phone} onChange={handleChange} suppressHydrationWarning
                    />
                  </div>
                  {phoneError && <p className="sg-form-error">{phoneError}</p>}
                </div>

                {/* Row 2: Company + Title */}
                <div className="sg-form-row" style={{ marginTop: 14 }}>
                  <div className="sg-form-field">
                    <label htmlFor="sg-company">Company</label>
                    <input
                      id="sg-company" name="company" type="text" required
                      placeholder="Company name"
                      value={form.company} onChange={handleChange} suppressHydrationWarning
                    />
                  </div>
                  <div className="sg-form-field">
                    <label htmlFor="sg-title">Job Title</label>
                    <input
                      id="sg-title" name="jobTitle" type="text" required
                      placeholder="Your role"
                      value={form.jobTitle} onChange={handleChange} suppressHydrationWarning
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="sg-form-field" style={{ marginTop: 14 }}>
                  <label htmlFor="sg-message">Message <span style={{ color: SG_GRAY, fontWeight: 400 }}>(Optional)</span></label>
                  <textarea
                    id="sg-message" name="message" rows={3}
                    placeholder="Anything you'd like us to know..."
                    value={form.message} onChange={handleChange} suppressHydrationWarning
                  />
                </div>

                {errorMsg && <p className="sg-form-error" style={{ marginTop: 10 }}>{errorMsg}</p>}

                {/* Submit */}
                <button type="submit" disabled={loading} className="sg-form-submit">
                  {loading ? "Sending…" : (
                    <>
                      Register Now
                      <span aria-hidden className="sg-form-submit-arrow" style={{ display: "inline-block", marginLeft: 8 }}>→</span>
                    </>
                  )}
                </button>

                <p className="sg-form-note">
                  Your information is kept confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Custom Seagate form */
        .sg-form .sg-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .sg-form .sg-form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sg-form label {
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${SG_GRAY_DEEP};
          transition: color 0.3s ease;
        }
        .sg-form .sg-form-field:focus-within label {
          color: ${SG_ORANGE};
        }
        .sg-form input,
        .sg-form select,
        .sg-form textarea {
          width: 100%;
          padding: 13px 15px;
          background: rgba(10, 14, 18, 0.025);
          border: 1px solid rgba(10, 14, 18, 0.07);
          border-radius: 11px;
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: ${SG_NAVY};
          outline: none;
          transition:
            border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.2s ease;
          letter-spacing: -0.005em;
          box-shadow: inset 0 1px 2px rgba(10, 14, 18, 0.04);
        }
        .sg-form input::placeholder,
        .sg-form textarea::placeholder {
          color: rgba(10, 14, 18, 0.3);
        }
        .sg-form input:hover:not(:focus),
        .sg-form select:hover:not(:focus),
        .sg-form textarea:hover:not(:focus) {
          border-color: rgba(10, 14, 18, 0.14);
          background: rgba(10, 14, 18, 0.04);
        }
        .sg-form input:focus,
        .sg-form select:focus,
        .sg-form textarea:focus {
          border-color: ${SG_ORANGE};
          background: ${SG_WHITE};
          box-shadow:
            0 0 0 4px rgba(113, 181, 63, 0.14),
            inset 0 1px 2px rgba(10, 14, 18, 0.02);
        }
        .sg-form textarea {
          resize: vertical;
          min-height: 84px;
          line-height: 1.5;
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
        }
        .sg-form .sg-form-phone {
          display: flex;
          gap: 8px;
        }
        .sg-form .sg-form-phone select {
          width: 120px;
          flex-shrink: 0;
          appearance: none;
          -webkit-appearance: none;
          font-weight: 500;
          background-image: linear-gradient(45deg, transparent 50%, ${SG_NAVY} 50%),
                            linear-gradient(135deg, ${SG_NAVY} 50%, transparent 50%);
          background-position: calc(100% - 16px) center, calc(100% - 11px) center;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
          padding-right: 32px;
          cursor: pointer;
        }
        .sg-form .sg-form-error {
          margin: 6px 0 0;
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 11.5px;
          color: #dc2626;
        }
        .sg-form .sg-form-submit {
          position: relative;
          width: 100%;
          margin-top: 26px;
          padding: 16px 24px;
          background: linear-gradient(180deg, ${SG_GREEN_BRIGHT} 0%, ${SG_ORANGE} 100%);
          border: none;
          border-radius: 13px;
          color: ${SG_WHITE};
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          overflow: hidden;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.32),
            inset 0 -1px 0 rgba(10, 14, 18, 0.12),
            0 4px 12px rgba(113, 181, 63, 0.28),
            0 12px 32px rgba(113, 181, 63, 0.18);
          transition:
            background 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sg-form .sg-form-submit::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.22) 50%,
            transparent 100%
          );
          transition: left 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sg-form .sg-form-submit:hover:not(:disabled) {
          background: linear-gradient(180deg, ${SG_NAVY} 0%, ${SG_NAVY_DEEP} 100%);
          transform: translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 6px 16px rgba(10, 14, 18, 0.24),
            0 16px 40px rgba(10, 14, 18, 0.18);
        }
        .sg-form .sg-form-submit:hover:not(:disabled)::after {
          left: 100%;
        }
        .sg-form .sg-form-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .sg-form .sg-form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .sg-form .sg-form-note {
          margin: 16px 0 0;
          text-align: center;
          font-family: Georgia, "Cambria", "Times New Roman", serif;
          font-style: italic;
          font-size: 11.5px;
          color: ${SG_GRAY};
          letter-spacing: 0.005em;
        }
        /* Submit arrow slides right on hover */
        .sg-form-submit-arrow {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sg-form-submit:hover:not(:disabled) .sg-form-submit-arrow {
          transform: translateX(4px);
        }
        /* Live status dot pulse — slow, breathing */
        @keyframes sgLivePulse {
          0%, 100% {
            box-shadow: 0 0 8px ${SG_ORANGE}80, 0 0 0 0 ${SG_ORANGE}55;
          }
          50% {
            box-shadow: 0 0 12px ${SG_ORANGE}cc, 0 0 0 5px ${SG_ORANGE}00;
          }
        }
        .sg-live-dot {
          animation: sgLivePulse 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        /* Bullet-dot hover — outer ring grows */
        .sg-register-feat {
          transition: color 0.3s ease;
        }
        .sg-register-feat .sg-register-dot {
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sg-register-feat:hover {
          color: ${SG_ORANGE};
        }
        .sg-register-feat:hover .sg-register-dot {
          border-color: ${SG_ORANGE};
          transform: scale(1.15);
        }
        @media (max-width: 900px) {
          .sg-register-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(32px, 5vw, 48px) !important;
          }
        }
        @media (max-width: 480px) {
          .sg-form .sg-form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function SeagateFooter() {
  return (
    <footer style={{
      background: SG_NAVY_DEEP,
      padding: "clamp(40px, 5vw, 64px) 0",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Image
            src={LOGO_2C_NEG}
            alt="Seagate"
            width={260}
            height={52}
            style={{ height: 52, width: "auto", opacity: 0.95 }}
          />
        </div>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0,
          display: "inline-flex", alignItems: "center", gap: 10,
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
              style={{ height: 36, width: "auto", opacity: 0.85 }}
            />
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SeagatePage() {
  return (
    <div style={{
      background: SG_WHITE,
      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
      color: SG_NAVY,
    }}>
      <SeagateNav />
      <HeroSection />
      <StatementSection />
      <TakeawaysSection />
      <SpeakersSection />
      <AgendaSection />
      <AboutSection />
      <RegisterSection />
      <SeagateFooter />
    </div>
  );
}
