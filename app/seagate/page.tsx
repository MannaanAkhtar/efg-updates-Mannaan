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

const EVENT_TARGET = "2026-06-17T10:30:00+04:00";

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

type AgendaRow = {
  start: string;
  end: string;
  duration: string;
  segment: string;
  subtitle?: string;
  description?: string;
  owner: string;
  type: "neutral" | "feature" | "break";
};

const AGENDA: AgendaRow[] = [
  { start: "10:00", end: "10:30", duration: "30 min", segment: "Guest Arrival, Registration & Welcome Coffee", owner: "Event Operations Team", type: "neutral" },
  { start: "10:30", end: "10:35", duration: "5 min",  segment: "Welcome Remarks & Opening Notes", owner: "Event Host", type: "neutral" },
  { start: "10:35", end: "11:00", duration: "25 min", segment: "Opening Executive Keynote", subtitle: "The Future of Enterprise Infrastructure in the AI Era", owner: "Featured Industry Speaker", type: "feature" },
  { start: "11:00", end: "11:30", duration: "30 min", segment: "Seagate Executive Leadership Session", subtitle: "Tomorrow’s Data Infrastructure Delivered Today", owner: "Seagate Leadership Team", type: "feature" },
  { start: "11:30", end: "12:00", duration: "30 min", segment: "Executive Experience Showcase & Immersive Illusion Performance", owner: "Special Segment", type: "feature" },
  { start: "12:00", end: "12:15", duration: "15 min", segment: "Networking Coffee Break", owner: "All Delegates", type: "break" },
  { start: "12:15", end: "12:45", duration: "30 min", segment: "Deployment Experience Discussion", subtitle: "Scaling Enterprise Storage & Infrastructure for AI-Driven Growth", owner: "Seagate Infrastructure Experts", type: "feature" },
  { start: "12:45", end: "13:15", duration: "30 min", segment: "Executive Leadership Discussion", subtitle: "Building AI-Ready Infrastructure Without Exploding Cost, Complexity, and Energy Consumption", description: "A leadership conversation on scaling enterprise infrastructure for the next era of AI, cloud, and data growth.", owner: "Moderator + Industry Leaders", type: "feature" },
  { start: "13:15", end: "13:30", duration: "15 min", segment: "Executive Q&A & Audience Discussion", owner: "Moderator + Panelists", type: "neutral" },
  { start: "13:30", end: "13:35", duration: "5 min",  segment: "Closing Remarks & Vote of Thanks", owner: "Event Host / Moderator", type: "neutral" },
  { start: "13:35", end: "—",     duration: "—",      segment: "Executive Networking Lunch", owner: "All Delegates", type: "break" },
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
  {
    name: "Hani Adnan Abdel Razeq",
    title: "Director of Sustainability",
    org: "AESG",
    role: "Panelist",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Hani_Adnan_Abdel_Razeq.png",
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
  { id: "venue", label: "Venue" },
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
      background: scrolled ? "rgba(5,7,10,0.94)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "background 0.35s ease, border-color 0.35s ease",
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
  //
  // Perf gate: useInView with a generous bottom margin so we KEEP the
  // mesh + particles mounted while the hero is even partially visible,
  // but UNMOUNT/PAUSE them entirely once the user scrolls past. The
  // MeshGradient is a WebGL canvas running every frame; the 60-particle
  // SVG runs CSS keyframe animations on every circle. Hiding them when
  // scrolled away is the single biggest scroll-smoothness win.
  const heroActive = useInView(ref, { margin: "0px 0px -10% 0px" });

  return (
    <section
      ref={ref}
      id="top"
      data-hero-active={heroActive ? "true" : "false"}
      style={{
        position: "relative", overflow: "hidden",
        background: "#000000",
        minHeight: "100svh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        paddingTop: "clamp(96px, 11vh, 130px)",
        paddingBottom: "clamp(36px, 5vh, 60px)",
      }}
    >
      {/* ── Layer -1: Hero photograph — Exos chassis anchored right, ambient anchor (not subject) ── */}
      <Image
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/seagate_harware-hero.jpg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "right center",
          zIndex: 0,
          opacity: 0.94,
          filter: "saturate(108%) contrast(106%) brightness(98%)",
        }}
      />

      {/* ── Layer 0: Mesh gradient — softened so it tints the photo without dominating.
            mix-blend-mode dropped: it was forcing the entire stack to recomposite
            every scroll frame. Plain opacity gives a close-enough look without the
            per-frame cost. Only rendered while hero is in view — once scrolled
            past, the WebGL canvas unmounts so it stops eating GPU cycles. ── */}
      {heroActive && (
        <MeshGradient
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.38 }}
          colors={["#000000", "#020806", "#0a2418", "#1f5a32", "#3FB99B"]}
          speed={0.32}
          distortion={0.7}
          swirl={0.55}
          grainOverlay={0.05}
        />
      )}

      {/* ── Layer 0b: Left-anchored dark gradient — pushes the photo back, keeps headline column readable ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: `linear-gradient(90deg,
            rgba(0,0,0,0.96) 0%,
            rgba(0,0,0,0.88) 16%,
            rgba(0,0,0,0.55) 36%,
            rgba(0,0,0,0.22) 58%,
            rgba(0,0,0,0.08) 78%,
            rgba(0,0,0,0) 100%
          )`,
          pointerEvents: "none",
        }}
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
         Per-particle drop-shadow REMOVED: it was forcing the compositor
         to rasterize 60 separate filter passes every frame. Replaced
         with a single SVG <filter> referenced once via filter="url(#sg-glow)"
         on the wrapping <g> — the browser rasterizes the glow once and
         caches the result. Also gated by heroActive so the whole SVG
         drops out of the render tree when scrolled past. ── */}
      {heroActive && (
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
          <defs>
            <filter id="sg-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
          <g filter="url(#sg-glow)">
            {PARTICLES.map((p, i) => {
              const style: React.CSSProperties & Record<string, string> = {
                animation: `sg-particle-float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
                transformOrigin: `${p.cx}px ${p.cy}px`,
                "--sg-drift": `${(p.drift * 0.18).toFixed(2)}px`,
              };
              return (
                <circle
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  r={round4(p.r * 0.32)}
                  fill={p.color}
                  opacity={p.opacity}
                  style={style}
                />
              );
            })}
          </g>
        </svg>
      )}

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
              fontSize: "clamp(11px, 0.92vw, 13px)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.88)",
            }}>
              Executive Infrastructure Leadership Boardroom <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>in Partnership with</span> Seagate
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
            <span style={{ color: SG_WHITE }}>17 June 2026</span>
          </div>
        </div>

        {/* ─── MAIN: single left-anchored headline column ─────────────────
            Editorial treatment — Söhne Breit display weight for the
            statement, italic Georgia accent in Seagate green. Boardroom
            feel, not billboard. Right side stays open so the chassis
            reads as ambient anchor. ─── */}
        <div className="sg-hero-headline" style={{
          maxWidth: "min(920px, 68vw)",
          position: "relative",
        }}>
          {/* Thin green hairline accent — boardroom signature */}
          <span
            aria-hidden
            style={{
              display: "block",
              width: "clamp(48px, 6vw, 78px)",
              height: 2,
              background: `linear-gradient(90deg, ${SG_ORANGE}, ${SG_TEAL})`,
              borderRadius: 2,
              marginBottom: "clamp(20px, 2.4vh, 30px)",
              boxShadow: `0 0 12px ${SG_ORANGE}55`,
            }}
          />

          {/* H1 — mixed-case Söhne Breit + italic Georgia accent */}
          <h1 style={{
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(28px, 4.4vw, 62px)",
            fontWeight: 500,
            color: SG_WHITE,
            letterSpacing: "-0.02em",
            lineHeight: 1.04,
            margin: 0,
            textAlign: "left",
            textShadow: "0 2px 24px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.4)",
            textWrap: "balance" as "balance",
          }}>
            <span className="sg-h1-word sg-h1-word-1" style={{ display: "block" }}>
              Tomorrow&rsquo;s Data Infrastructure
            </span>
            <span
              className="sg-h1-word sg-h1-word-2"
              style={{
                display: "block",
                fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                fontStyle: "italic",
                fontWeight: 400,
                color: SG_GREEN_BRIGHT,
                fontSize: "1.08em",
                letterSpacing: "-0.012em",
                marginTop: "0.16em",
                textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 16px rgba(0,0,0,0.55)",
              }}
            >
              Delivered Today
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="sg-hero-reveal-pullquote"
            style={{
              marginTop: "clamp(22px, 2.8vh, 34px)",
              marginBottom: 0,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(13.5px, 1.05vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.62,
              letterSpacing: "0.005em",
              color: "rgba(255,255,255,0.78)",
              maxWidth: 560,
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              textWrap: "pretty" as "pretty",
            }}
          >
            Powering the infrastructure behind enterprise growth, cloud expansion, and AI-scale data environments.
          </p>

          {/* ── CTA row — primary action + ghost secondary ── */}
          <div
            className="sg-hero-cta-row sg-hero-reveal-pullquote"
            style={{
              marginTop: "clamp(28px, 3.4vh, 40px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(14px, 1.4vw, 22px)",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#register"
              className="sg-cta-primary"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: "clamp(12.5px, 0.95vw, 14px)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "#0A0E12",
                background: `linear-gradient(135deg, ${SG_GREEN_BRIGHT} 0%, ${SG_ORANGE} 100%)`,
                textDecoration: "none",
                boxShadow: `0 8px 24px ${SG_ORANGE}40, 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.35)`,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              Request Invitation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a
              href="#agenda"
              className="sg-cta-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 20px",
                borderRadius: 999,
                fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                fontSize: "clamp(12.5px, 0.95vw, 14px)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.88)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.18)",
                textDecoration: "none",
                transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
              }}
            >
              View Agenda
            </a>
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
            <span>Vida Hotel, Skyline Ballroom, Dubai Mall, UAE</span>
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

        /* Perf gate: when the hero is scrolled out of view, pause every
           continuous animation inside it so the browser stops burning
           main-thread + compositor cycles on stuff the user can't see. */
        [data-hero-active="false"] .sg-pulse-dot,
        [data-hero-active="false"] .sg-emblem,
        [data-hero-active="false"] .sg-slash,
        [data-hero-active="false"] circle {
          animation-play-state: paused !important;
        }

        /* Hero CTAs */
        .sg-cta-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px ${SG_ORANGE}60, 0 4px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.45);
        }
        .sg-cta-primary:active {
          transform: translateY(0);
        }
        .sg-cta-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.3);
          color: #FFFFFF;
        }

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
const OVERVIEW_WORDS = "The Next Wave of Enterprise Infrastructure Is Already Here".split(" ");

function StatementSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    <div ref={sectionRef} id="overview" style={{
      background: "transparent",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "clamp(56px, 7vh, 88px) 0 clamp(72px, 9vh, 110px)",
      position: "relative",
    }}>
      {/* Statement-specific accents — ambient halos only; wrapper handles base BG + frame */}
      {/* Ambient orange accent (upper right) */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-15%", right: "-12%",
        width: "60%", height: "85%",
        background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${SG_ORANGE}1a 0%, ${SG_ORANGE}08 35%, transparent 70%)`,
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 2,
        transform: "translateZ(0)",
        willChange: "transform",
      }} />

      {/* Ambient teal counter-glow (lower left) */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-18%", left: "-12%",
        width: "60%", height: "75%",
        background: `radial-gradient(ellipse 55% 50% at 50% 50%, ${SG_GREEN_BRIGHT}14 0%, ${SG_GREEN_BRIGHT}06 35%, transparent 70%)`,
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 2,
        transform: "translateZ(0)",
        willChange: "transform",
      }} />

      <div className="sg-ov-wrap" style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 56px)",
        position: "relative", zIndex: 5,
        width: "100%",
      }}>
        {/* Cinematic title block — centred, full-width */}
        <div ref={headerRef} className="sg-ov-title" style={{
          textAlign: "center",
          maxWidth: 960,
          margin: "0 auto clamp(36px, 5vh, 56px)",
        }}>
          <div className="sg-ov-kicker-row" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, justifyContent: "center" }}>
            <div className="sg-ov-dash" style={{
              width: 40, height: 2,
              background: `linear-gradient(90deg, transparent, ${SG_ORANGE})`,
              borderRadius: 1,
              transform: "scaleX(0)",
              transformOrigin: "right center",
            }} />
            <span className="sg-ov-kicker" style={{
              display: "inline-flex", alignItems: "center",
              padding: "7px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.25)",
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 11, fontWeight: 600,
              letterSpacing: "0.36em", textTransform: "uppercase",
              color: SG_ORANGE,
              opacity: 0,
            }}>
              Why This Matters
            </span>
            <div className="sg-ov-dash" style={{
              width: 40, height: 2,
              background: `linear-gradient(90deg, ${SG_ORANGE}, transparent)`,
              borderRadius: 1,
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }} />
          </div>

          {/* Heading — cinematic, word-by-word blur reveal */}
          <div ref={headingRef} style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 clamp(10px, 1.2vw, 18px)",
            marginBottom: 20,
            textWrap: "balance" as "balance",
          }}>
            {OVERVIEW_WORDS.map((word, i) => {
              const isGreen = word === "Enterprise" || word === "Infrastructure";
              return (
                <span key={i} className="sg-reveal-word" style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(28px, 4.2vw, 56px)",
                  fontWeight: 600,
                  letterSpacing: "-0.028em",
                  lineHeight: 1.04,
                  display: "inline-block",
                  opacity: 0,
                  background: isGreen
                    ? `linear-gradient(180deg, ${SG_GREEN_BRIGHT} 0%, ${SG_GREEN_BRIGHT} 55%, ${SG_TEAL} 100%)`
                    : "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, rgba(255,255,255,0.86) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: isGreen
                    ? `drop-shadow(0 2px 24px rgba(0,0,0,0.42)) drop-shadow(0 0 18px ${SG_GREEN_BRIGHT}55)`
                    : "drop-shadow(0 2px 24px rgba(0,0,0,0.42))",
                }}>
                  {word}
                </span>
              );
            })}
          </div>

          {/* Gradient divider — grows from centre */}
          <div className="sg-ov-divider" style={{
            width: 64, height: 2,
            background: `linear-gradient(90deg, ${SG_ORANGE}, ${SG_GREEN_BRIGHT})`,
            borderRadius: 1,
            margin: "0 auto",
            transform: "scaleX(0)",
            transformOrigin: "center",
          }} />
        </div>

        {/* Body — single intro line + 4-col pressure strip + Mozaic tag */}
        <div ref={bodyRef} className="sg-ov-body-col" style={{
          maxWidth: 980,
          margin: "0 auto",
          textAlign: "center",
        }}>
          <p className="sg-ov-para" style={{
            fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
            fontSize: "clamp(15px, 1.25vw, 18px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.65,
            margin: "0 auto 36px",
            opacity: 0,
            letterSpacing: "-0.005em",
            maxWidth: 760,
          }}>
            AI workloads, cloud expansion, and exponential data growth are forcing enterprises to{" "}
            <span style={{
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic",
              fontWeight: 500,
              color: SG_WHITE,
              fontSize: "1.08em",
            }}>
              rethink infrastructure at scale
            </span>
            .
          </p>

          {/* Pressure points — 4-col strategy strip */}
          <div className="sg-ov-para sg-ov-pressures" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 0,
            margin: "0 auto 36px",
            maxWidth: 920,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            paddingBlock: "clamp(20px, 2.6vh, 28px)",
            opacity: 0,
            position: "relative",
          }}>
            {/* Top hairline accent that grows on section reveal */}
            <span aria-hidden style={{
              position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
              width: "min(80%, 360px)", height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${SG_ORANGE}aa 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            {[
              { n: "01", label: "AI-Driven Growth" },
              { n: "02", label: "Operational Complexity" },
              { n: "03", label: "Rising Energy Costs" },
              { n: "04", label: "Scale Without Replacement" },
            ].map((p, i) => (
              <div key={p.n} className="sg-ov-pressure" style={{
                padding: "clamp(4px, 0.6vh, 6px) clamp(10px, 1.4vw, 20px)",
                textAlign: "left",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                display: "flex", flexDirection: "column", gap: 10,
                position: "relative",
                transition: "background 0.35s ease",
              }}>
                {/* Per-cell top indicator rail — animates orange on hover */}
                <span aria-hidden className="sg-ov-pressure-rail" style={{
                  position: "absolute", top: -1, left: "8%", right: "8%",
                  height: 2,
                  background: SG_ORANGE,
                  borderRadius: 1,
                  opacity: 0,
                  transform: "scaleX(0)",
                  transformOrigin: "center",
                  transition: "opacity 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: "none",
                }} />
                <span className="sg-ov-pressure-num" style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: 10.5, fontWeight: 600,
                  letterSpacing: "0.24em", textTransform: "uppercase",
                  color: SG_ORANGE,
                  transition: "color 0.3s ease, text-shadow 0.3s ease",
                }}>
                  {p.n}
                </span>
                <span className="sg-ov-pressure-label" style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(13px, 1.05vw, 15px)",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.008em",
                  lineHeight: 1.32,
                  transition: "color 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          <p className="sg-ov-para" style={{
            fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
            fontStyle: "italic",
            fontSize: "clamp(14.5px, 1.15vw, 17px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.6,
            margin: "0 auto 32px",
            opacity: 0,
            letterSpacing: "0",
            maxWidth: 720,
          }}>
            <span aria-hidden style={{
              display: "inline-block",
              width: 18, height: 1,
              background: `${SG_ORANGE}99`,
              verticalAlign: "middle",
              marginRight: 12,
              marginBottom: 3,
            }} />
            This executive boardroom brings together enterprise technology leaders to discuss how organizations can build scalable, energy-efficient, and future-ready infrastructure strategies.
          </p>

          {/* Liquid-glass callout — Mozaic 4+ (dark) */}
          <div className="sg-ov-callout" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "14px 28px", borderRadius: 999,
            background: `linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, ${SG_ORANGE}1c 100%)`,
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.32), 0 10px 32px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.22), 0 0 0 0 ${SG_ORANGE}00`,
            opacity: 0,
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, background 0.4s ease",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: SG_ORANGE,
              boxShadow: `0 0 6px ${SG_ORANGE}cc, 0 0 14px ${SG_ORANGE}66`,
              animation: "sgCalloutPulse 2.4s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              color: "rgba(255,255,255,0.92)", letterSpacing: "0.005em",
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
        /* Pressure cell hover — orange rail slides in, number brightens, label nudges right */
        .sg-ov-pressure:hover {
          background: rgba(255,255,255,0.025);
        }
        .sg-ov-pressure:hover .sg-ov-pressure-rail {
          opacity: 1;
          transform: scaleX(1);
        }
        .sg-ov-pressure:hover .sg-ov-pressure-num {
          color: ${SG_ORANGE};
          text-shadow: 0 0 10px ${SG_ORANGE}55;
        }
        .sg-ov-pressure:hover .sg-ov-pressure-label {
          color: #ffffff;
          transform: translateX(2px);
        }
        /* Mozaic callout — premium lift on hover */
        .sg-ov-callout:hover {
          transform: translateY(-1px);
          background: linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, ${SG_ORANGE}22 100%) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.32), 0 14px 38px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.28), 0 0 28px ${SG_ORANGE}22 !important;
        }
        @media (max-width: 860px) {
          .sg-ov-pressures {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            row-gap: 18px !important;
          }
          .sg-ov-pressure {
            border-right: none !important;
          }
          .sg-ov-pressure:nth-child(odd) {
            border-right: 1px solid rgba(255,255,255,0.08) !important;
          }
        }
        @media (max-width: 540px) {
          .sg-ov-pressures {
            /* Stay in a 2x2 matrix on mobile — labels are short enough to fit. */
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            row-gap: 14px !important;
          }
          .sg-ov-pressure {
            border-right: none !important;
            padding: clamp(2px, 0.4vh, 4px) clamp(8px, 2.5vw, 12px) !important;
          }
          .sg-ov-pressure:nth-child(odd) {
            border-right: 1px solid rgba(255,255,255,0.08) !important;
          }
          .sg-ov-body-col {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Takeaways Section ──────────────────────────────────────────────────────
function TakeawaysSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} id="takeaways" style={{
      background: "transparent",
      padding: "clamp(72px, 9vh, 110px) 0 clamp(72px, 9vh, 112px)",
      position: "relative",
    }}>
      {/* Takeaways-specific anchor — Massive luminous orb, upper-right (boardroom skylight) */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-30%", right: "-15%",
        width: "min(900px, 70vw)",
        height: "min(900px, 70vw)",
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${SG_GREEN_BRIGHT}10 0%, ${SG_TEAL}08 28%, ${SG_GREEN_BRIGHT}03 55%, transparent 78%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0,
        transform: "translateZ(0)",
        willChange: "transform",
      }} />

      {/* Layer 2 — Architectural concentric rings, lower-left (premium watch-face anchor) */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-45%", left: "-22%",
        width: "min(900px, 75vw)",
        height: "min(900px, 75vw)",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.04)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-35%", left: "-12%",
        width: "min(700px, 60vw)",
        height: "min(700px, 60vw)",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.05)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-22%", left: "-2%",
        width: "min(500px, 42vw)",
        height: "min(500px, 42vw)",
        borderRadius: "50%",
        border: `1px solid ${SG_ORANGE}14`,
        pointerEvents: "none",
        zIndex: 0,
      }} />


      <div style={{
        maxWidth: 1080, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 72px)",
        position: "relative", width: "100%",
        zIndex: 3,
      }}>
        {/* Single confident headline — left-aligned */}
        <h2 style={{
          fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
          fontSize: "clamp(24px, 3.4vw, 46px)",
          fontWeight: 600,
          letterSpacing: "-0.034em",
          lineHeight: 1.06,
          color: SG_WHITE,
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
          borderTop: `1px solid rgba(255,255,255,0.10)`,
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
                borderBottom: `1px solid rgba(255,255,255,0.10)`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.9s ${0.25 + i * 0.12}s cubic-bezier(0.22,1,0.36,1), transform 0.9s ${0.25 + i * 0.12}s cubic-bezier(0.22,1,0.36,1), background 0.4s ease`,
              }}
            >
              {/* Hover sweep */}
              <span aria-hidden className="sg-takeaway-sweep" style={{
                position: "absolute",
                left: 0, right: 0, bottom: -1,
                height: 1,
                background: SG_ORANGE,
                boxShadow: `0 0 12px ${SG_ORANGE}88`,
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
                  color: "rgba(255,255,255,0.95)",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.92,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 2px 18px rgba(0,0,0,0.45)",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(16px, 1.8vw, 26px)",
                  fontWeight: 200,
                  color: SG_ORANGE,
                  lineHeight: 1,
                  textShadow: `0 0 12px ${SG_ORANGE}55`,
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
                  color: SG_WHITE,
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
                  color: "rgba(255,255,255,0.7)",
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
        .sg-takeaway-row {
          background: transparent;
        }
        .sg-takeaway-row:hover {
          background: rgba(255,255,255,0.02);
        }
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
    </div>
  );
}

// ─── Speakers Section ───────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="speakers" style={{
      background: "transparent",
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative",
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
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.14) 80%, transparent 100%)",
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
              color: SG_WHITE,
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
            color: "rgba(255,255,255,0.55)",
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
                  boxShadow: "0 1px 2px rgba(0,0,0,0.35), 0 12px 32px rgba(0,0,0,0.45)",
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
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.26)",
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
                    color: SG_WHITE,
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
                    color: "rgba(255,255,255,0.85)",
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
                    color: "rgba(255,255,255,0.6)",
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
            0 2px 4px rgba(0, 0, 0, 0.45),
            0 28px 56px rgba(0, 0, 0, 0.55) !important;
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
      background: "transparent",
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", position: "relative" }}>

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
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 15%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.14) 85%, transparent 100%)",
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
              color: SG_WHITE, margin: 0,
            }}>
              How the day unfolds.
            </h2>
            <p style={{
              margin: "clamp(10px, 1.4vh, 14px) 0 0",
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(13px, 1vw, 14.5px)",
              color: "rgba(255,255,255,0.62)",
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
            color: "rgba(255,255,255,0.55)",
            opacity: inView ? 1 : 0,
            transition: "opacity 1.2s 0.25s ease",
          }}>
            <span>17 Jun 2026</span>
            <span aria-hidden style={{ width: 18, height: 1, background: "rgba(255,255,255,0.22)" }} />
            <span>Dubai</span>
          </div>
        </div>

        {/* Rows — 2-column split */}
        {(() => {
          const splitAt = Math.ceil(AGENDA.length / 2);
          const renderRow = (item: AgendaRow, originalIdx: number, isLastInCol: boolean) => {
            const isFeature = item.type === "feature";
            const isBreak = item.type === "break";
            return (
              <div
                key={originalIdx}
                className={`sg-agenda-row${isFeature ? " is-feature" : ""}${isBreak ? " is-break" : ""}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2px 1fr",
                  gap: "clamp(14px, 1.8vw, 22px)",
                  alignItems: "stretch",
                  padding: "clamp(14px, 1.8vh, 20px) clamp(10px, 1.2vw, 16px)",
                  borderBottom: isLastInCol ? "none" : "1px solid rgba(255,255,255,0.10)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15 + originalIdx * 0.05}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15 + originalIdx * 0.05}s, background 0.35s ease`,
                  position: "relative",
                }}
              >
                {/* Left rail marker */}
                <div aria-hidden className="sg-agenda-marker" style={{
                  alignSelf: "stretch",
                  background: isFeature ? SG_ORANGE : isBreak ? "transparent" : "rgba(255,255,255,0.12)",
                  borderRadius: 1,
                }} />

                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Top row: time range + duration label */}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <span className="sg-agenda-time-main" style={{
                      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                      fontSize: "clamp(16px, 1.3vw, 18.5px)", fontWeight: 600,
                      color: isBreak ? "rgba(255,255,255,0.5)" : SG_WHITE,
                      fontVariantNumeric: "tabular-nums", letterSpacing: "-0.012em",
                      transition: "color 0.3s ease",
                    }}>
                      {item.start}
                      {item.end !== "—" && <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}> – {item.end}</span>}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                      fontSize: 9.5, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}>
                      {item.duration}
                    </span>
                  </div>

                  {/* Segment heading + optional subtitle + optional description */}
                  <div>
                    <h3 style={{
                      margin: 0,
                      fontFamily: isBreak
                        ? `Georgia, "Cambria", "Times New Roman", serif`
                        : "var(--font-sohne-breit), system-ui, sans-serif",
                      fontStyle: isBreak ? "italic" : "normal",
                      fontSize: isFeature ? "clamp(16px, 1.35vw, 19px)" : "clamp(14.5px, 1.2vw, 17px)",
                      fontWeight: isFeature ? 600 : isBreak ? 400 : 500,
                      color: isBreak ? "rgba(255,255,255,0.62)" : SG_WHITE,
                      letterSpacing: "-0.018em", lineHeight: 1.32,
                    }}>
                      {item.segment}
                    </h3>
                    {item.subtitle && (
                      <p style={{
                        margin: "6px 0 0",
                        fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                        fontStyle: "italic",
                        fontSize: "clamp(13px, 1.05vw, 15px)",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.72)",
                        letterSpacing: "-0.008em",
                        lineHeight: 1.42,
                      }}>
                        {item.subtitle}
                      </p>
                    )}
                    {item.description && (
                      <p style={{
                        margin: "8px 0 0",
                        fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                        fontSize: "clamp(11.5px, 0.95vw, 13px)",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.62)",
                        letterSpacing: "-0.003em",
                        lineHeight: 1.55,
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom row: featured badge (left) + owner (right) */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 2 }}>
                    {isFeature ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                        fontSize: 9.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase",
                        color: SG_ORANGE,
                      }}>
                        <span aria-hidden style={{ width: 14, height: 1, background: SG_ORANGE }} />
                        Featured
                      </span>
                    ) : <span aria-hidden />}
                    <span style={{
                      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                      fontSize: "clamp(11px, 0.9vw, 12.5px)", fontWeight: 400,
                      color: isBreak ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.72)",
                      letterSpacing: "-0.005em",
                      lineHeight: 1.4,
                      textAlign: "right",
                    }}>
                      {item.owner}
                    </span>
                  </div>
                </div>
              </div>
            );
          };

          return (
            <div className="sg-agenda sg-agenda-cols" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              columnGap: "clamp(36px, 5vw, 72px)",
              position: "relative",
            }}>
              <div>
                {AGENDA.slice(0, splitAt).map((item, j) => renderRow(item, j, j === splitAt - 1))}
              </div>
              {/* Center hairline — fades in at top and bottom */}
              <div
                aria-hidden
                className="sg-agenda-divider"
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.10) 12%, rgba(255,255,255,0.10) 88%, transparent 100%)`,
                }}
              />
              <div>
                {AGENDA.slice(splitAt).map((item, j) => renderRow(item, j + splitAt, j === AGENDA.length - splitAt - 1))}
              </div>
            </div>
          );
        })()}

        {/* Closing footnote — italic Georgia, gentle */}
        <p style={{
          margin: "clamp(22px, 3vh, 32px) 0 0",
          fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
          fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(11.5px, 0.9vw, 12.5px)",
          color: "rgba(255,255,255,0.45)",
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
          background: rgba(143, 224, 96, 0.06);
        }
        .sg-agenda-row.is-feature:hover {
          background: rgba(143, 224, 96, 0.10);
        }
        .sg-agenda-row:hover .sg-agenda-time-main {
          color: ${SG_ORANGE} !important;
        }
        @media (max-width: 860px) {
          .sg-agenda-cols {
            grid-template-columns: 1fr !important;
            column-gap: 0 !important;
          }
          .sg-agenda-divider {
            display: none !important;
          }
        }
        @media (max-width: 760px) {
          .sg-agenda-row {
            padding: clamp(12px, 2.4vw, 16px) clamp(6px, 1vw, 10px) !important;
            column-gap: 12px !important;
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
      background: "transparent",
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative",
    }}>
      {/* Ambient lime halo — behind the right image */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", right: "-5%",
        transform: "translateY(-50%) translateZ(0)",
        width: "55%", height: "75%",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${SG_ORANGE}1c 0%, ${SG_TEAL}0d 35%, transparent 70%)`,
        pointerEvents: "none",
        filter: "blur(40px)",
        willChange: "transform",
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
              letterSpacing: "-0.028em", lineHeight: 1.1,
              color: SG_WHITE, margin: 0, maxWidth: 580,
            }}>
              Storage That Scales With the Data You Can&rsquo;t Afford to Lose
            </h2>

            <p style={{
              margin: "clamp(16px, 2vh, 22px) 0 0",
              maxWidth: 540,
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(14px, 1.1vw, 16px)",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.55,
            }}>
              For more than four decades, Seagate has helped build the infrastructure powering the world&rsquo;s data-driven economy.
            </p>

            <p style={{
              marginTop: "clamp(20px, 2.4vh, 28px)",
              maxWidth: 560,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(13px, 1.05vw, 14.5px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.72,
              letterSpacing: "-0.003em",
            }}>
              From hyperscale data centres to AI workloads reshaping every industry, Seagate&rsquo;s high-capacity storage technologies support some of the world&rsquo;s most demanding enterprise environments — delivering scalability, reliability, and efficiency at global scale.
            </p>

            <p style={{
              marginTop: "clamp(16px, 2vh, 22px)",
              maxWidth: 560,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(13px, 1.05vw, 14.5px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.72,
              letterSpacing: "-0.003em",
            }}>
              The next evolution arrives with Mozaic 4+ technology — enabling more data per drive, lower power consumption, and infrastructure designed for the era of mass capacity.
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
                background: "rgba(255,255,255,0.05)",
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
              filter: "blur(30px)",
              pointerEvents: "none",
              transform: "translateZ(0)",
              willChange: "transform",
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

        {/* ─── Full-width stats row — below the 2-col grid ─── */}
        <div
          className="sg-about-stats"
          style={{
            marginTop: "clamp(48px, 6vh, 76px)",
            paddingTop: "clamp(36px, 4vh, 48px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(28px, 3.4vw, 56px)",
          }}
        >
          {[
            { value: "40%", suffix: "", label: "of the world's data is stored on Seagate drives" },
            { value: "40%", suffix: "Less Energy", label: "compared to conventional storage alternatives" },
            { value: "7-Year", suffix: "Technology Span", label: "built for long-term infrastructure planning" },
            { value: "100TB", suffix: "Pathway", label: "scalable upgrade path from 30–50TB toward next-generation capacity" },
          ].map((s, i) => (
            <div
              key={i}
              className="sg-about-stat"
              style={{
                position: "relative",
                paddingTop: 18,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.08}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.08}s`,
              }}
            >
              {/* Top hairline — green→teal accent */}
              <span
                aria-hidden
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: 38, height: 2,
                  background: `linear-gradient(90deg, ${SG_ORANGE}, ${SG_TEAL})`,
                  borderRadius: 2,
                  boxShadow: `0 0 10px ${SG_ORANGE}45`,
                }}
              />

              {/* Value + suffix on shared baseline */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  flexWrap: "wrap",
                  rowGap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                    fontSize: "clamp(28px, 3.4vw, 44px)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.02,
                    color: SG_GREEN_BRIGHT,
                  }}
                >
                  {s.value}
                </span>
                {s.suffix && (
                  <span
                    style={{
                      fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                      fontSize: "clamp(13px, 1.05vw, 15.5px)",
                      fontWeight: 600,
                      letterSpacing: "0.005em",
                      color: "rgba(255,255,255,0.86)",
                    }}
                  >
                    {s.suffix}
                  </span>
                )}
              </div>

              {/* Descriptor line */}
              <p
                style={{
                  margin: "12px 0 0",
                  fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
                  fontSize: "clamp(12px, 0.95vw, 13.5px)",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  letterSpacing: "0.003em",
                  color: "rgba(255,255,255,0.62)",
                  textWrap: "pretty" as "pretty",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
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
        @media (max-width: 980px) {
          .sg-about-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            row-gap: clamp(28px, 4vh, 36px) !important;
          }
        }
        @media (max-width: 520px) {
          .sg-about-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Venue Section — full-bleed image with editorial overlay ────────────────
function VenueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      id="venue"
      style={{
        position: "relative",
        height: "clamp(420px, 60vh, 600px)",
        overflow: "hidden",
        marginTop: "clamp(40px, 6vh, 72px)",
      }}
    >
      {/* Background image — full-bleed. Lazy-loaded (below the fold by ~5
          sections) + GPU-composited so the photo rasterizes once into its
          own layer instead of repainting on scroll. */}
      <Image
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Vida_Hotel.png"
        alt="Vida Hotel — Skyline Ballroom, Dubai Mall"
        fill
        loading="lazy"
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center center",
          filter: "saturate(105%) contrast(104%) brightness(96%)",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }}
      />

      {/* Left-to-right dark gradient — keeps the bottom-left text legible */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(95deg,
            rgba(0,0,0,0.86) 0%,
            rgba(0,0,0,0.7) 22%,
            rgba(0,0,0,0.4) 44%,
            rgba(0,0,0,0.12) 66%,
            rgba(0,0,0,0) 88%
          )`,
          pointerEvents: "none",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }}
      />

      {/* Top + bottom soft fades — blends with the dark zone above and the register section below */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg,
            rgba(2,6,10,0.55) 0%,
            transparent 22%,
            transparent 70%,
            rgba(2,6,10,0.6) 100%
          )`,
          pointerEvents: "none",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }}
      />

      {/* Text overlay — bottom-left, anchored to maxWidth grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(36px, 5.5vh, 64px) clamp(20px, 4vw, 56px)",
            width: "100%",
          }}
        >
          {/* Green hairline accent — page micro-pattern */}
          <span
            aria-hidden
            style={{
              display: "block",
              width: "clamp(40px, 4vw, 56px)",
              height: 2,
              background: `linear-gradient(90deg, ${SG_ORANGE}, ${SG_TEAL})`,
              borderRadius: 2,
              marginBottom: "clamp(16px, 2vh, 22px)",
              boxShadow: `0 0 12px ${SG_ORANGE}55`,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s 0.1s cubic-bezier(0.22,1,0.36,1), transform 0.8s 0.1s cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          {/* Kicker */}
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: SG_ORANGE,
              marginBottom: "clamp(12px, 1.6vh, 16px)",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s 0.2s cubic-bezier(0.22,1,0.36,1), transform 0.8s 0.2s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Venue
          </span>

          {/* Venue name */}
          <h2
            style={{
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: "clamp(34px, 5vw, 68px)",
              fontWeight: 700,
              letterSpacing: "-0.028em",
              lineHeight: 1.02,
              color: SG_WHITE,
              margin: 0,
              textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.95s 0.32s cubic-bezier(0.22,1,0.36,1), transform 0.95s 0.32s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Vida Hotel
          </h2>

          {/* Subline — italic Georgia editorial */}
          <p
            style={{
              margin: "clamp(8px, 1.2vh, 12px) 0 0",
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(16px, 1.6vw, 24px)",
              color: SG_GREEN_BRIGHT,
              letterSpacing: "-0.005em",
              lineHeight: 1.3,
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.95s 0.44s cubic-bezier(0.22,1,0.36,1), transform 0.95s 0.44s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Skyline Ballroom · Dubai Mall
          </p>

          {/* Map link */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Vida+Dubai+Mall"
            target="_blank"
            rel="noopener noreferrer"
            className="sg-venue-map-cta"
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: "clamp(20px, 2.6vh, 28px)",
              padding: "11px 18px",
              borderRadius: 999,
              fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
              fontSize: 12.5,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.86)",
              textDecoration: "none",
              background: "rgba(20,28,32,0.55)",
              border: "1px solid rgba(255,255,255,0.22)",
              transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transitionDelay: "0.56s",
            }}
          >
            View on Map
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        .sg-venue-map-cta:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 255, 255, 0.36) !important;
          color: #ffffff !important;
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
      background: "transparent",
      padding: "clamp(64px, 8vh, 96px) 0",
      position: "relative",
    }}>
      {/* Subtle ambient — lime kiss in top-right */}
      <div aria-hidden style={{
        position: "absolute", top: "-15%", right: "-10%",
        width: "55%", height: "75%",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${SG_ORANGE}10 0%, ${SG_TEAL}06 40%, transparent 75%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
        transform: "translateZ(0)",
        willChange: "transform",
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
              color: SG_WHITE, margin: 0, maxWidth: 480,
            }}>
              Reserve your seat.
            </h2>

            <p style={{
              margin: "clamp(14px, 1.8vh, 20px) 0 0",
              maxWidth: 480,
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(13.5px, 1.05vw, 15px)",
              color: "rgba(255,255,255,0.65)",
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
              color: "rgba(255,255,255,0.78)",
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
              background: "linear-gradient(90deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 60%, transparent 100%)",
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
                  color: "rgba(255,255,255,0.92)",
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

          {/* RIGHT — Custom Seagate form (kept light as a focal action card) */}
          <div className="sg-register-form" style={{
            background: `linear-gradient(180deg, ${SG_WHITE} 0%, #FAFAF7 100%)`,
            borderRadius: 20,
            padding: "clamp(28px, 3vw, 40px)",
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.95)",
              "0 1px 3px rgba(0,0,0,0.25)",
              "0 16px 48px rgba(0,0,0,0.4)",
              "0 40px 96px rgba(0,0,0,0.45)",
            ].join(", "),
            border: "1px solid rgba(255,255,255,0.12)",
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

      {/* Unified dark zone — single section, single BG, continuous flow across all sections */}
      <section className="sg-dark-zone" style={{
        background: `
          radial-gradient(ellipse 45% 12% at 80% 4%, rgba(55, 115, 85, 0.22) 0%, transparent 65%),
          radial-gradient(ellipse 50% 14% at 18% 14%, rgba(30, 80, 55, 0.18) 0%, transparent 62%),
          radial-gradient(ellipse 60% 14% at 50% 22%, ${SG_TEAL}10 0%, transparent 68%),
          radial-gradient(ellipse 42% 14% at 82% 32%, rgba(55, 120, 90, 0.20) 0%, transparent 65%),
          radial-gradient(ellipse 48% 14% at 22% 42%, rgba(35, 90, 65, 0.18) 0%, transparent 65%),
          radial-gradient(ellipse 38% 12% at 70% 52%, ${SG_ORANGE}10 0%, transparent 65%),
          radial-gradient(ellipse 55% 14% at 30% 60%, rgba(40, 100, 75, 0.18) 0%, transparent 65%),
          radial-gradient(ellipse 45% 14% at 78% 70%, rgba(55, 120, 90, 0.20) 0%, transparent 65%),
          radial-gradient(ellipse 60% 14% at 50% 80%, ${SG_TEAL}10 0%, transparent 68%),
          radial-gradient(ellipse 50% 14% at 20% 88%, rgba(35, 90, 65, 0.18) 0%, transparent 65%),
          radial-gradient(ellipse 40% 12% at 70% 96%, ${SG_ORANGE}14 0%, transparent 65%),
          linear-gradient(180deg, #060d0a 0%, #04080a 50%, #02060a 100%)
        `,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        // GPU-composite: rasterize the heavy mesh gradient ONCE, just translate on scroll.
        // Avoids per-frame repaints of 11 radial layers + linear base.
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}>
        {/* Wrapper-level grain noise — luxury film texture spanning all dark sections */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundSize: "200px 200px",
          opacity: 0.035,
          pointerEvents: "none",
          zIndex: 1,
          // GPU-composite: tile pattern only paints once into the layer.
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }} />

        {/* Wrapper-level edge vignette — frames the whole dark zone */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 0%, transparent 65%, rgba(2,5,8,0.4) 92%, rgba(1,3,6,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Top hairline — at the very top of the dark zone (just under Hero) */}
        <div aria-hidden style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${SG_ORANGE}66 50%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }} />

        {/* Bottom hairline — at the very bottom of the dark zone */}
        <div aria-hidden style={{
          position: "absolute",
          bottom: 0, left: "20%", right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${SG_GREEN_BRIGHT}55 50%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }} />

        <StatementSection />
        <TakeawaysSection />
        <SpeakersSection />
        <AgendaSection />
        <AboutSection />
        <VenueSection />
        <RegisterSection />
      </section>

      <SeagateFooter />
    </div>
  );
}
