"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Footer, InquiryForm } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";

// ─── Design tokens (OT Security First UAE 2027 — magenta on near-black) ───────
const C = "#D34B9A";        // Magenta
const C_BRIGHT = "#EE7CBC"; // Bright pink
const C_LIGHT = "#F2AED2";  // Light pink (text on tint)
const C_DEEP = "#B03A80";   // Deep magenta
const BG = "#0A0A0A";       // Base
const BG_2 = "#0E0E0E";     // Alt section
const INK = "#0A0A0A";
const EASE = [0.16, 1, 0.3, 1] as const;

const FD = "var(--font-display)";   // Plus Jakarta Sans
const FO = "var(--font-outfit)";    // Outfit
const FDM = "var(--font-dm-sans)";  // DM Sans

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;
const HERO_VIDEO = `${S3}/hero+videos/OTSEC+cuts+text.mp4`;
const HERO_POSTER = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT+UAE.png";

// OT Security First UAE 2025 event photography for the section image slots.
// Numbers reference files in the OT UAE photo set — swap the 4N8A0### as needed.
const OT_UAE = `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos`;
const IMG = {
  skyline: `${OT_UAE}/4N8A0490.JPG`,
  attend: `${OT_UAE}/4N8A0668.JPG`,
  network: `${OT_UAE}/4N8A0810.JPG`,
  question: `${OT_UAE}/4N8A0476.JPG`,
  partner: `${OT_UAE}/4N8A0420.JPG`,
};

// ─── Reusable style fragments ────────────────────────────────────────────────
const CARD_BG = "linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.012))";
const CARD_BORDER = "1px solid rgba(255,255,255,0.09)";
const CARD_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.09),0 24px 48px -30px rgba(0,0,0,0.9)";
const TINT_CARD = `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 44%,#8E2A64 100%)`;

// Gradient-clipped text — spread alongside a `background` gradient on accent words.
const CLIP: React.CSSProperties = { color: "transparent", WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundClip: "text" };

const wrap: React.CSSProperties = { maxWidth: 1320, margin: "0 auto", padding: "clamp(38px,4.4vw,68px) clamp(20px,4vw,60px)", position: "relative", zIndex: 1 };

// ─── Numbered section header ─────────────────────────────────────────────────
function SectionHead({ num, label, note, right }: { num: string; label: string; note?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 20, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "clamp(28px,4vw,44px)" }}>
      <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,3.4vw,44px)", letterSpacing: "-2px", lineHeight: 1, color: "rgba(255,255,255,0.14)" }}>{num}</span>
      <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "2.6px", textTransform: "uppercase", color: C }}>{label}</span>
      {right ?? (note ? <span style={{ marginLeft: "auto", fontFamily: FO, fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#585858" }}>{note}</span> : null)}
    </div>
  );
}

const tagPill: React.CSSProperties = {
  fontFamily: FO, fontSize: 12, padding: "7px 13px", borderRadius: 9999,
  background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.11)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.68)",
};
const tagPillHot: React.CSSProperties = {
  fontFamily: FO, fontSize: 12, padding: "7px 13px", borderRadius: 9999,
  background: `linear-gradient(180deg,${C}33,${C}0f)`, border: `1px solid ${C}61`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)", color: C_LIGHT,
};

function Tag({ children, hot }: { children: React.ReactNode; hot?: boolean }) {
  return <span style={hot ? tagPillHot : tagPill}>{children}</span>;
}

// ─── Fixed ambient background (magenta radial glows) ─────────────────────────
function AmbientBg() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 60% 40% at 15% 0%, ${C}1a 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 95% 30%, ${C}0f 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(232,101,26,0.05) 0%, transparent 55%)` }} />
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
// Poster paints immediately (it's preloaded in layout as the LCP); the 4.7 MB
// video is only mounted once the browser is idle, keeping it off the critical path.
function HeroBackground() {
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (w.requestIdleCallback) { const id = w.requestIdleCallback(() => setShowVideo(true), { timeout: 2000 }); return () => w.cancelIdleCallback?.(id); }
    const t = window.setTimeout(() => setShowVideo(true), 600); return () => window.clearTimeout(t);
  }, []);
  const cover: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) brightness(0.62)", zIndex: 0 };
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_POSTER} alt="" aria-hidden fetchPriority="high" decoding="async" style={cover} />
      {showVideo && (
        <video autoPlay muted loop playsInline preload="auto" style={{ ...cover, zIndex: 0 }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}
    </>
  );
}

function Hero() {
  const industries = ["Government", "Energy", "Oil & Gas", "Utilities", "Petrochemicals", "Manufacturing", "Critical Infrastructure"];
  return (
    <section id="top" style={{ position: "relative", minHeight: "min(940px,96vh)", display: "flex", alignItems: "flex-end", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <HeroBackground />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.58) 0%, rgba(10,10,10,0.14) 30%, rgba(10,10,10,0.62) 68%, #0A0A0A 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(ellipse 70% 60% at 12% 100%, ${C}42 0%, transparent 62%)` }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.35, backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "88px 88px", maskImage: "linear-gradient(180deg,transparent,#000 40%,transparent)", WebkitMaskImage: "linear-gradient(180deg,transparent,#000 40%,transparent)" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1480, margin: "0 auto", padding: "clamp(170px,22vh,260px) clamp(24px,4.5vw,72px) clamp(48px,5vw,72px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 34, padding: "7px 22px 7px 7px", borderRadius: 9999, border: `1px solid ${C}55`, background: `linear-gradient(180deg, ${C}26, ${C}07)`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 34px -14px ${C}`, overflow: "hidden", position: "relative" }}
        >
          <span aria-hidden className="uae-hero-shine" />
          <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(180deg, ${C}, ${C_DEEP})`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.42), 0 2px 12px ${C}80` }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3c2.6 2.5 3.9 5.7 3.9 9s-1.3 6.5-3.9 9c-2.6-2.5-3.9-5.7-3.9-9S9.4 5.5 12 3z" />
            </svg>
          </span>
          <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ fontFamily: FO, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase", color: "#fff" }}>5<span style={{ fontSize: "0.72em", verticalAlign: "super", letterSpacing: "1px" }}>th</span></span>
            <span style={{ width: 1, height: 12, background: `${C}66`, alignSelf: "center" }} />
            <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 600, letterSpacing: "2.6px", textTransform: "uppercase", color: C_LIGHT }}>Global Edition</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
          style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(46px,6.7vw,98px)", letterSpacing: "-3px", lineHeight: 0.95, margin: 0, maxWidth: 1120, textWrap: "balance", textShadow: "0 2px 44px rgba(0,0,0,0.55)" }}
        >
          <span style={{ color: "#fff" }}>OT Security First</span>
          <br />
          <span style={{ background: `linear-gradient(100deg, ${C_LIGHT} 0%, ${C_BRIGHT} 42%, ${C} 100%)`, ...CLIP }}>UAE 2027.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{ display: "flex", alignItems: "stretch", gap: 18, marginTop: "clamp(24px,2.6vw,34px)", maxWidth: 760 }}
        >
          <span aria-hidden style={{ flex: "0 0 auto", width: 3, borderRadius: 2, background: `linear-gradient(180deg, ${C_BRIGHT}, ${C_DEEP})`, boxShadow: `0 0 18px ${C}` }} />
          <p style={{ fontFamily: FD, fontWeight: 500, color: "rgba(255,255,255,0.66)", fontSize: "clamp(19px,2.1vw,31px)", letterSpacing: "-0.6px", lineHeight: 1.24, margin: 0 }}>
            Securing the UAE&rsquo;s operational technology and <span style={{ color: C_LIGHT }}>critical infrastructure.</span>
          </p>
        </motion.div>

        <div className="uae-hero-meta" style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 28, marginTop: 44, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexShrink: 0 }}>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3vw,40px)", letterSpacing: "-1.4px", color: "#fff", lineHeight: 1 }}>27 January 2027</span>
            <span style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: C }}>Abu Dhabi · UAE</span>
          </div>
          <div className="uae-hero-cta" style={{ display: "flex", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
            <a href="#register" className="uae-cta-solid" style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FO, fontSize: 14.5, fontWeight: 700, letterSpacing: "0.2px", padding: "16px 32px", borderRadius: 9999, background: `linear-gradient(180deg, ${C_BRIGHT} 0%, ${C} 52%, ${C_DEEP} 100%)`, color: INK, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -10px 20px -12px rgba(0,0,0,0.45), 0 12px 30px -12px ${C}`, whiteSpace: "nowrap" }}>
              <span style={{ position: "relative", zIndex: 1 }}>Request an invitation</span>
              <span className="uae-cta-arrow" style={{ position: "relative", zIndex: 1 }}>→</span>
            </a>
            <a href="#partner" className="uae-cta-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14.5, fontWeight: 600, letterSpacing: "0.2px", padding: "16px 30px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.2)", background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))", color: "#fff", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)", whiteSpace: "nowrap" }}>Partnership enquiry</a>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}>
          {industries.map((t) => (
            <span key={t} className="uae-sector" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FO, fontSize: 11.5, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", padding: "9px 16px 9px 13px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.12)", background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.015))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.74)" }}>
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: C, boxShadow: `0 0 8px ${C}` }} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STAT PLATES ─────────────────────────────────────────────────────────────
function StatPlates() {
  const plates: { big: React.ReactNode; label: string; hot?: boolean }[] = [
    { big: <>5<span style={{ color: C, fontSize: "0.6em" }}>th</span></>, label: "Global Edition" },
    { big: <>250<span style={{ fontSize: "0.6em", color: "rgba(255,255,255,0.85)" }}>+</span></>, label: "Senior Delegates", hot: true },
    { big: <>35<span style={{ color: C, fontSize: "0.6em" }}>+</span></>, label: "Speakers" },
    { big: <>6<span style={{ color: C, fontSize: "0.6em" }}>+</span></>, label: "Critical Industries" },
  ];
  return (
    <section style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(20px,4vw,60px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        {plates.map((p, i) => (
          <div key={i} className="uae-plate" style={{
            position: "relative", overflow: "hidden",
            borderRadius: 24, padding: "20px 26px",
            background: p.hot
              ? `linear-gradient(158deg, ${C_BRIGHT} 0%, ${C} 46%, #8E2A64 100%)`
              : "linear-gradient(158deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.012) 100%)",
            border: p.hot ? "1px solid rgba(255,255,255,0.36)" : "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
            boxShadow: p.hot
              ? `inset 0 1.5px 0 rgba(255,255,255,0.72), inset 0 4px 12px rgba(255,255,255,0.32), inset 0 -28px 46px -24px rgba(0,0,0,0.5), 0 34px 62px -26px ${C}, 0 0 72px -26px ${C_BRIGHT}`
              : "inset 0 1.5px 0 rgba(255,255,255,0.26), inset 0 4px 10px rgba(255,255,255,0.06), inset 0 -34px 48px -32px rgba(0,0,0,0.85), 0 30px 54px -28px rgba(0,0,0,0.95)",
          }}>
            {/* top liquid-glass dome reflection */}
            <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "54%", background: p.hot ? "linear-gradient(180deg, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.07) 58%, transparent 100%)" : "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.025) 58%, transparent 100%)", borderRadius: "26px 26px 46% 46% / 26px 26px 30% 30%", pointerEvents: "none" }} />
            {/* crisp top-edge glass highlight */}
            <span aria-hidden style={{ position: "absolute", top: 8, left: "8%", right: "8%", height: 1.5, borderRadius: 2, background: p.hot ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
            {/* corner light sheen */}
            <span aria-hidden style={{ position: "absolute", top: "-34%", right: "-18%", width: "64%", height: "88%", background: p.hot ? "radial-gradient(ellipse at center, rgba(255,255,255,0.38), transparent 70%)" : "radial-gradient(ellipse at center, rgba(255,255,255,0.13), transparent 70%)", filter: "blur(8px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(38px,4vw,56px)", letterSpacing: "-2px", lineHeight: 1, color: "#fff", textShadow: p.hot ? "0 2px 14px rgba(0,0,0,0.42)" : "0 2px 18px rgba(0,0,0,0.65)" }}>{p.big}</div>
              <div style={{ width: 28, height: 3, borderRadius: 2, background: p.hot ? "rgba(255,255,255,0.85)" : `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, boxShadow: p.hot ? "0 0 12px rgba(255,255,255,0.55)" : `0 0 14px ${C}b3`, margin: "12px 0 9px" }} />
              <div style={{ fontFamily: FO, fontSize: 11, fontWeight: p.hot ? 700 : 500, letterSpacing: "1.5px", textTransform: "uppercase", color: p.hot ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.44)" }}>{p.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Image tile ──────────────────────────────────────────────────────────────
function ImageTile({ src, alt, radius = 32, minHeight, pos, children }: { src: string; alt: string; radius?: number; minHeight?: string | number; pos?: string; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", minHeight, borderRadius: radius, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 34px 70px -34px rgba(0,0,0,0.95)" }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 820px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: pos || "center" }} />
      {children}
    </div>
  );
}

// ─── Click-to-play YouTube facade (premium bezel) ────────────────────────────
function EventVideo({ id, eyebrow, caption }: { id: string; eyebrow: string; caption: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", background: "#000", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 44px 90px -44px rgba(0,0,0,0.95), 0 0 70px -34px ${C}` }}>
      {play ? (
        <iframe
          title={caption}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlay(true)} aria-label={`Play video — ${caption}`} className="uae-video-btn" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", padding: 0, border: "none", background: "none", cursor: "pointer", display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt={caption} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.12) 0%, transparent 28%, rgba(10,10,10,0.32) 62%, rgba(10,10,10,0.92) 100%)" }} />
          <span aria-hidden className="uae-video-play" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.16)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.42)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 44px rgba(0,0,0,0.5)" }}>
            <span style={{ width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: "18px solid #fff", marginLeft: 5 }} />
          </span>
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "left", padding: "clamp(20px,2.4vw,32px)" }}>
            <span style={{ display: "block", fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C_LIGHT, marginBottom: 9 }}>{eyebrow}</span>
            <span style={{ display: "block", fontFamily: FD, fontWeight: 600, fontSize: "clamp(17px,1.7vw,23px)", letterSpacing: "-0.6px", lineHeight: 1.24, color: "#fff", maxWidth: 440 }}>{caption}</span>
          </span>
        </button>
      )}
    </div>
  );
}

// ─── 01 · THE EVENT ──────────────────────────────────────────────────────────
function TheEvent() {
  const facts = [
    { t: "Convened", b: "Regulators, CISOs, OT leaders, plant executives" },
    { t: "Framed by", b: "The UAE’s CIIP national framework" },
    { t: "Format", b: "Invite-only · one day · executive" },
  ];
  return (
    <section id="event" style={wrap}>
      <SectionHead num="01" label="The Event" note="Abu Dhabi · 27.01.2027" />
      <div style={{ marginBottom: "clamp(28px,3.4vw,48px)", maxWidth: 1120 }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.4px", lineHeight: 1.0, margin: 0, textWrap: "balance", color: "#fff" }}>
          OT is the backbone of the{" "}
          <span style={{ background: `linear-gradient(100deg, ${C_LIGHT} 0%, ${C_BRIGHT} 44%, ${C} 100%)`, ...CLIP }}>UAE&rsquo;s critical infrastructure.</span>
        </h2>
        <div style={{ display: "flex", alignItems: "stretch", gap: 18, marginTop: "clamp(20px,2.4vw,30px)", maxWidth: 640 }}>
          <span aria-hidden style={{ flex: "0 0 auto", width: 3, borderRadius: 2, background: `linear-gradient(180deg, ${C_BRIGHT}, ${C_DEEP})`, boxShadow: `0 0 18px ${C}` }} />
          <p style={{ fontFamily: FD, fontWeight: 500, fontSize: "clamp(18px,1.8vw,25px)", letterSpacing: "-0.6px", lineHeight: 1.28, margin: 0, color: "rgba(255,255,255,0.66)" }}>
            A compromise stops <span style={{ color: "#fff", fontWeight: 600 }}>production</span> — not just data.
          </p>
        </div>
      </div>
      <div className="uae-event-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,0.86fr) minmax(0,1.32fr)", gap: "clamp(26px,3vw,48px)", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {facts.map((f, idx) => (
            <div key={f.t} style={{ display: "flex", alignItems: "baseline", gap: "clamp(14px,1.6vw,22px)", padding: "clamp(13px,1.5vw,17px) 0", borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.09)" }}>
              <div style={{ flex: "0 0 clamp(78px,8vw,96px)", fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: C }}>{f.t}</div>
              <div style={{ fontFamily: FD, fontSize: "clamp(15px,1.3vw,18px)", fontWeight: 500, lineHeight: 1.45, color: "rgba(255,255,255,0.84)", letterSpacing: "-0.3px" }}>{f.b}</div>
            </div>
          ))}
        </div>
        <EventVideo id="3ofcPquafgk" eyebrow="From policy to implementation" caption="The executive platform for the UAE&rsquo;s OT ecosystem." />
      </div>
    </section>
  );
}

// ─── 02 · WHY ABU DHABI ──────────────────────────────────────────────────────
function WhyAbuDhabi() {
  const frameworks = [
    { title: "Department of Energy", body: "Security of supply and sustainability of energy and water." },
    { title: "2050 Framework", body: "Decarbonisation, digital transformation, AI-driven innovation." },
  ];
  return (
    <section id="abudhabi" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={wrap}>
        <SectionHead num="02" label="Why Abu Dhabi" />
        <div style={{ marginBottom: "clamp(28px,3.4vw,48px)", maxWidth: 1000 }}>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.02, margin: 0, textWrap: "balance", color: "#fff" }}>
            The heart of the UAE&rsquo;s{" "}
            <span style={{ background: `linear-gradient(100deg, ${C_LIGHT} 0%, ${C_BRIGHT} 44%, ${C} 100%)`, ...CLIP }}>critical infrastructure ecosystem.</span>
          </h2>
          <div style={{ display: "flex", alignItems: "stretch", gap: 18, marginTop: "clamp(18px,2.2vw,28px)", maxWidth: 620 }}>
            <span aria-hidden style={{ flex: "0 0 auto", width: 3, borderRadius: 2, background: `linear-gradient(180deg, ${C_BRIGHT}, ${C_DEEP})`, boxShadow: `0 0 18px ${C}` }} />
            <p style={{ fontFamily: FD, fontWeight: 500, fontSize: "clamp(17px,1.7vw,23px)", letterSpacing: "-0.5px", lineHeight: 1.3, margin: 0, color: "rgba(255,255,255,0.66)" }}>Energy, industry and intelligence — <span style={{ color: "#fff", fontWeight: 600 }}>one emirate.</span></p>
          </div>
        </div>

        <div className="uae-ad-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.12fr) minmax(0,1fr)", gap: "clamp(24px,3vw,48px)", alignItems: "center" }}>
          <ImageTile src={IMG.skyline} alt="Abu Dhabi — capital of the UAE and heart of its critical infrastructure" minHeight="clamp(340px,40vw,500px)">
            <div style={{ position: "absolute", top: 24, left: 24, pointerEvents: "none", padding: "9px 16px", borderRadius: 9999, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>Abu Dhabi, UAE</div>
          </ImageTile>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,3.2vw,44px)" }}>
            <div>
              <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: C, marginBottom: 14 }}>Industrial Strategy</div>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(50px,6.6vw,100px)", letterSpacing: "-4px", lineHeight: 0.9, color: "#fff" }}>
                <span style={{ fontSize: "0.32em", fontWeight: 700, color: "rgba(255,255,255,0.48)", letterSpacing: "-1px", verticalAlign: "middle", marginRight: 10 }}>AED</span>10<span style={{ background: `linear-gradient(180deg, ${C_BRIGHT}, ${C})`, ...CLIP }}> bn</span>
              </div>
              <p style={{ fontFamily: FO, fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: "16px 0 0", maxWidth: 380 }}>Government investment in Industry 4.0 and smart manufacturing.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {frameworks.map((f, i) => (
                <div key={f.title} style={{ display: "flex", gap: "clamp(16px,1.6vw,22px)", padding: "clamp(16px,1.8vw,22px) 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ flex: "0 0 auto", fontFamily: FD, fontWeight: 800, fontSize: "clamp(17px,1.6vw,22px)", letterSpacing: "-0.5px", color: C, lineHeight: 1 }}>{`0${i + 1}`}</span>
                  <div>
                    <div style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(16px,1.5vw,20px)", letterSpacing: "-0.4px", color: "#fff", marginBottom: 6 }}>{f.title}</div>
                    <div style={{ fontFamily: FO, fontSize: "clamp(13px,1.2vw,14.5px)", lineHeight: 1.6, color: "#8E8E8E" }}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", marginTop: "clamp(24px,3vw,44px)", borderRadius: 28, padding: "clamp(26px,3.4vw,44px) clamp(28px,4vw,60px)", background: `radial-gradient(ellipse 90% 150% at 50% 0%, ${C}32, transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))`, border: `1px solid ${C}47`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 60px -34px rgba(0,0,0,0.95)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "clamp(12px,1.3vw,16px)" }}>
            <svg aria-hidden width="38" height="29" viewBox="0 0 32 24" style={{ flex: "0 0 auto", marginTop: "0.12em" }}>
              <path d="M3 14C3 7 7 2 14 1L14 5C10 6 8 9 8 12L13 12L13 22L3 22Z M18 14C18 7 22 2 29 1L29 5C25 6 23 9 23 12L28 12L28 22L18 22Z" fill={C} opacity="0.45" />
            </svg>
            <p className="uae-ad-quote" style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(18px,2.3vw,34px)", letterSpacing: "-1.2px", lineHeight: 1.15, color: "#fff", margin: 0, whiteSpace: "nowrap" }}>An ideal setting for a dedicated OT cybersecurity summit.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 03 · THE MANDATE (accordion) ────────────────────────────────────────────
const QUESTIONS: [string, string, string][] = [
  ["01", "Securing legacy OT without disrupting operations", "Brownfield plants, unsupported controllers and 24/7 availability — sequencing security into environments that cannot stop."],
  ["02", "IT/OT convergence without expanding the attack surface", "Segmentation, identity, secure remote access and cloud designed so convergence adds visibility, not exposure."],
  ["03", "Risk-based OT security for critical infrastructure operators", "Translating the CIIP baseline into asset criticality, risk profiles and investment the board can sign off."],
  ["04", "Government, regulators and industry on national OT resilience", "Information sharing, sector threat intelligence and joint exercises across authorities and operators."],
  ["05", "Protecting ICS while maintaining safety and production", "Where security controls meet safety instrumented systems, change management and production KPIs."],
  ["06", "What effective OT incident response looks like", "Playbooks, cross-functional command and recovery of physical processes when engineering and security respond together."],
  ["07", "AI that strengthens rather than compromises OT security", "Anomaly detection weighed against model security, data integrity and autonomous decision-making in OT."],
];

function TheMandate() {
  return (
    <section id="mandate" style={wrap}>
      <SectionHead num="03" label="The Mandate" note="Seven questions" />
      <div style={{ marginBottom: "clamp(26px,3.2vw,44px)", maxWidth: 980 }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.02, margin: 0, textWrap: "balance", color: "#fff" }}>
          From national policy{" "}
          <span style={{ background: `linear-gradient(100deg, ${C_LIGHT} 0%, ${C_BRIGHT} 44%, ${C} 100%)`, ...CLIP }}>to industrial resilience.</span>
        </h2>
      </div>
      <div className="uae-mandate-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", columnGap: "clamp(28px,4vw,72px)" }}>
        {QUESTIONS.map(([n, t, b], i) => (
          <div key={n} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "clamp(13px,1.4vw,20px)", padding: "clamp(15px,1.7vw,21px) 0", borderTop: "1px solid rgba(255,255,255,0.09)", alignItems: "start" }}>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(16px,1.5vw,21px)", letterSpacing: "-0.5px", lineHeight: 1.25, background: `linear-gradient(180deg, ${C_BRIGHT}, ${C})`, ...CLIP }}>{n}</span>
            <div>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(15px,1.35vw,18.5px)", letterSpacing: "-0.4px", lineHeight: 1.26, color: "#fff", margin: "0 0 7px" }}>{t}</h3>
              <p style={{ fontFamily: FO, fontSize: "clamp(12.5px,1.05vw,13.5px)", lineHeight: 1.55, color: "#8E8E8E", margin: 0 }}>{b}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 04 · MARKET DRIVERS ─────────────────────────────────────────────────────
const DRIVERS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Digital Transformation", body: "Isolated operational environments are connecting to enterprise networks, cloud and AI." },
  { n: "02", title: "IT/OT Convergence", body: "New opportunities. New attack paths." },
  { n: "03", title: "Critical Infrastructure Protection", body: "CIIP sets baseline security, assurance and enforcement. Cyber becomes operational governance." },
  { n: "04", title: "Energy Transition", body: "Smart grids, storage, EV infrastructure and digital energy management create new OT estates." },
  { n: "05", title: "Smart Manufacturing", body: "Connected factories require connected cybersecurity." },
  { n: "06", title: "AI & Automation", body: "Intelligence moves closer to the plant floor — and must be secured with it." },
];

function MarketDrivers() {
  return (
    <section id="drivers" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ ...wrap, maxWidth: 1480 }}>
        <SectionHead num="04" label="Market Drivers" note="Six forces" />
        <div style={{ marginBottom: "clamp(26px,3.2vw,44px)", maxWidth: 900 }}>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.02, margin: 0, textWrap: "balance", color: "#fff" }}>
            Why OT security became{" "}
            <span style={{ background: `linear-gradient(100deg, ${C_LIGHT} 0%, ${C_BRIGHT} 44%, ${C} 100%)`, ...CLIP }}>a board-level priority.</span>
          </h2>
        </div>
        <div className="uae-drivers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "clamp(20px,2vw,28px) clamp(22px,2.4vw,38px)" }}>
          {DRIVERS.map((d) => <DriverCard key={d.n} {...d} />)}
        </div>
      </div>
    </section>
  );
}

function DriverCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="uae-driver" style={{ position: "relative", paddingTop: "clamp(14px,1.4vw,18px)" }}>
      <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.13)" }} />
      <span aria-hidden className="uae-driver-tab" style={{ position: "absolute", top: 0, left: 0, height: 2, width: 54, borderRadius: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, ${C})`, boxShadow: `0 0 16px ${C}` }} />
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(10px,1.1vw,14px)" }}>
        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,2.8vw,46px)", letterSpacing: "-2px", lineHeight: 1, background: `linear-gradient(180deg, ${C_BRIGHT}, ${C})`, ...CLIP }}>{n}</span>
        <span aria-hidden className="uae-driver-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: C, boxShadow: `0 0 12px ${C}`, alignSelf: "center" }} />
      </div>
      <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(18px,1.6vw,23px)", letterSpacing: "-0.6px", lineHeight: 1.18, color: "#fff", margin: "0 0 10px" }}>{title}</h3>
      <p style={{ fontFamily: FO, fontSize: "clamp(13px,1.1vw,15px)", lineHeight: 1.62, color: "#8E8E8E", margin: 0 }}>{body}</p>
    </div>
  );
}

// ─── 05 · KEY THEMES ─────────────────────────────────────────────────────────
const THEMES: { eyebrow: string; title: string; tags: string[]; hot?: boolean }[] = [
  { eyebrow: "Governance & Regulation", title: "From national mandates to board-level OT governance", tags: ["UAE CIIP", "Cyber risk", "Compliance", "Board accountability"] },
  { eyebrow: "Energy & Critical Infrastructure", title: "Protecting the systems that keep the UAE running", tags: ["Power", "Water", "Oil & gas", "Nuclear", "Ports"] },
  { eyebrow: "IT/OT Convergence", title: "Breaking down the IT/OT security divide", tags: ["Segmentation", "Zero Trust", "Asset visibility", "Third-party risk"] },
  { eyebrow: "ICS / SCADA Security", title: "Protecting the industrial control layer", tags: ["PLC / DCS", "HMI", "Legacy systems", "OT monitoring"] },
  { eyebrow: "Incident Response & Resilience", title: "When prevention fails", tags: ["OT IR", "Ransomware", "Recovery", "Continuity"] },
  { eyebrow: "AI & the Future of OT", title: "Securing the intelligent industrial environment", tags: ["Predictive security", "Digital twins", "Autonomous ops", "AI risk"], hot: true },
];

const THEME_SPANS = [3, 3, 2, 2, 2, 6];

function ThemeTile({ th, i, span, featured }: { th: typeof THEMES[number]; i: number; span: number; featured: boolean }) {
  return (
    <div className="uae-card" style={{
      gridColumn: `span ${span}`, position: "relative", overflow: "hidden", borderRadius: 26,
      padding: featured ? "clamp(28px,3.2vw,46px)" : "clamp(24px,2.4vw,32px)",
      minHeight: featured ? "clamp(210px,19vw,260px)" : "clamp(176px,15vw,214px)",
      background: th.hot
        ? `radial-gradient(ellipse 95% 135% at 100% 0%, ${C}47, transparent 60%), linear-gradient(158deg, rgba(255,255,255,0.06), rgba(255,255,255,0.012))`
        : `radial-gradient(ellipse 80% 120% at 0% 0%, ${C}1a, transparent 58%), linear-gradient(158deg, rgba(255,255,255,0.055), rgba(255,255,255,0.012))`,
      border: th.hot ? `1px solid ${C}59` : "1px solid rgba(255,255,255,0.09)",
      boxShadow: th.hot
        ? `inset 0 1px 0 rgba(255,255,255,0.16), 0 30px 60px -34px rgba(0,0,0,0.95), 0 0 66px -30px ${C}`
        : "inset 0 1px 0 rgba(255,255,255,0.09), 0 24px 48px -32px rgba(0,0,0,0.9)",
      display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20,
    }}>
      <span aria-hidden style={{ position: "absolute", right: -8, bottom: featured ? -46 : -32, fontFamily: FD, fontWeight: 800, fontSize: featured ? "clamp(150px,15vw,220px)" : "clamp(96px,9vw,140px)", letterSpacing: "-6px", lineHeight: 1, color: th.hot ? `${C}24` : `${C}12`, pointerEvents: "none" }}>{String(i + 1).padStart(2, "0")}</span>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: th.hot ? C_LIGHT : C, marginBottom: 12 }}>{th.eyebrow}</div>
        <h3 className={featured ? "uae-theme-hero-title" : undefined} style={{ fontFamily: FD, fontWeight: 800, fontSize: featured ? "clamp(26px,3vw,42px)" : "clamp(19px,1.9vw,26px)", letterSpacing: "-1px", lineHeight: 1.12, color: "#fff", margin: 0, whiteSpace: featured ? "nowrap" : undefined, textWrap: featured ? undefined : "balance" }}>{th.title}</h3>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: 7 }}>
        {th.tags.map((t) => <Tag key={t} hot={th.hot}>{t}</Tag>)}
      </div>
    </div>
  );
}

function KeyThemes() {
  return (
    <section id="themes" style={wrap}>
      <SectionHead num="05" label="Key Themes" note="Six tracks" />
      <div style={{ marginBottom: "clamp(24px,3vw,42px)", maxWidth: 900 }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.02, margin: 0, textWrap: "balance", color: "#fff" }}>
          Six tracks.{" "}
          <span style={{ background: `linear-gradient(100deg, ${C_LIGHT} 0%, ${C_BRIGHT} 44%, ${C} 100%)`, ...CLIP }}>One operating reality.</span>
        </h2>
      </div>
      <div className="uae-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }}>
        {THEMES.map((th, i) => <ThemeTile key={th.eyebrow} th={th} i={i} span={THEME_SPANS[i]} featured={!!th.hot} />)}
      </div>
    </section>
  );
}

// ─── 06 · WHO ATTENDS ────────────────────────────────────────────────────────
const AUDIENCE: { title: string; count: string; roles: string[] }[] = [
  { title: "Executive Leadership", count: "07", roles: ["CISO", "CIO", "CTO", "CDO", "Chief Risk Officer", "COO", "Chief Engineering Officer"] },
  { title: "Cybersecurity Leadership", count: "10", roles: ["VP Cybersecurity", "Head of OT Security", "Head of ICS Security", "Head of SOC", "Threat Intelligence", "Cyber Risk Directors", "OT Security Managers"] },
  { title: "Industrial & Engineering", count: "10", roles: ["Plant Directors", "Operations Directors", "Automation Directors", "SCADA Managers", "Process Control", "IT/OT Convergence Leads", "Asset Management"] },
];

function WhoAttends() {
  const totalRoles = AUDIENCE.reduce((n, a) => n + a.roles.length, 0);
  return (
    <section id="attend" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ ...wrap, paddingTop: "clamp(30px,3.2vw,48px)", paddingBottom: "clamp(30px,3.2vw,48px)" }}>
        <SectionHead num="06" label="Who Attends" note="No fillers" />

        {/* Editorial lead — statement spread + portrait */}
        <div className="uae-attend-lead" style={{ display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: "clamp(20px,2.8vw,44px)", alignItems: "stretch", marginBottom: "clamp(20px,2.2vw,32px)" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "clamp(0px,1vw,10px)" }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, marginBottom: "clamp(18px,1.8vw,24px)" }} />
            <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.9vw,54px)", letterSpacing: "-2px", lineHeight: 1.02, margin: 0, color: "#fff" }}>
              One room.<span style={{ display: "block", color: "rgba(255,255,255,0.3)" }}>The people who keep it running.</span>
            </h2>
            <p style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.72, color: "rgba(255,255,255,0.62)", margin: "clamp(18px,1.9vw,26px) 0 0", maxWidth: 470 }}>
              A curated senior audience — invited by title, not by badge count. Three cohorts spanning government, the security function and the plant floor, in the same room for one day.
            </p>
            <div style={{ display: "flex", gap: "clamp(28px,3vw,44px)", marginTop: "clamp(22px,2.4vw,32px)" }}>
              {[{ n: String(AUDIENCE.length).padStart(2, "0"), l: "Decision cohorts" }, { n: String(totalRoles), l: "Target roles" }].map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,3.4vw,46px)", letterSpacing: "-2px", lineHeight: 1, background: `linear-gradient(120deg,#fff,${C_LIGHT})`, ...CLIP }}>{s.n}</div>
                  <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginTop: 8 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <ImageTile src={IMG.attend} alt="Executives in conversation at an OT Security First summit" minHeight="clamp(260px,22vw,330px)" pos="center top">
            <span aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(150deg, transparent 40%, ${C}22 100%)` }} />
          </ImageTile>
        </div>

        {/* Cohort directory — hanging labels + flowing roles */}
        <div style={{ display: "grid", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          {AUDIENCE.map((a, idx) => (
            <div key={a.title} className="uae-cohort" style={{ display: "grid", gridTemplateColumns: "minmax(220px,300px) 1fr", gap: "clamp(20px,3.4vw,58px)", padding: "clamp(18px,1.9vw,26px) 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {/* hanging label */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                <span className="uae-cohort-idx" style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,3vw,44px)", letterSpacing: "-2px", lineHeight: 0.9, color: "rgba(255,255,255,0.16)", transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)" }}>{String(idx + 1).padStart(2, "0")}</span>
                <div>
                  <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(19px,1.7vw,23px)", letterSpacing: "-0.8px", color: "#fff", margin: 0, lineHeight: 1.15 }}>{a.title}</h3>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                    <span style={{ width: 18, height: 2, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})` }} />
                    <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: C }}>{a.count} Roles</span>
                  </div>
                </div>
              </div>
              {/* flowing roles */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignContent: "flex-start" }}>
                {a.roles.map((r) => <span key={r} className="uae-cohort-role" style={{ ...tagPill, fontSize: 12.5, padding: "8px 14px", color: "rgba(255,255,255,0.72)", transition: "border-color 0.3s, color 0.3s, background 0.3s" }}>{r}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 07 · INDUSTRIES ─────────────────────────────────────────────────────────
const INDUSTRIES = ["Oil & Gas", "Petrochemicals", "Energy & Power", "Water & Utilities", "Nuclear", "Manufacturing", "Mining & Minerals", "Transportation", "Ports & Maritime", "Critical Infrastructure", "Advanced Manufacturing", "Smart Infrastructure"];

function Industries() {
  return (
    <section style={{ ...wrap, padding: "clamp(38px,4.4vw,66px) clamp(20px,4vw,60px)" }}>
      <SectionHead num="07" label="The Industries" right={<span style={{ marginLeft: "auto", fontFamily: FD, fontWeight: 800, fontSize: "clamp(15px,1.6vw,22px)", letterSpacing: "-0.6px", color: "rgba(255,255,255,0.5)" }}>Where IT meets the physical world</span>} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(10px,1vw,14px)" }}>
        {INDUSTRIES.map((n) => (
          <span key={n} className="uae-industry" style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", borderRadius: 9999, padding: "13px 24px", fontFamily: FD, fontWeight: 700, fontSize: "clamp(14px,1.05vw,16px)", letterSpacing: "-0.2px", color: "#fff", background: `linear-gradient(135deg, ${C}26 0%, rgba(255,255,255,0.045) 52%, ${C}14 100%)`, border: `1px solid ${C}3d`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 16px 34px -24px ${C}`, transition: "border-color 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, box-shadow 0.4s, transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}>{n}</span>
        ))}
      </div>
    </section>
  );
}

// ─── 08 · WHY ATTEND ─────────────────────────────────────────────────────────
function WhyAttend() {
  return (
    <section id="why" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={wrap}>
        <SectionHead num="08" label="Why Attend" />
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.03, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 880 }}>
          Frameworks you implement on Monday.<span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>Not buzzwords you forget by Friday.</span>
        </h2>
        <div className="uae-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }}>
          <WhyCard n="01" title="Learn from Government" body="How UAE policy and regulatory expectations are evolving." />
          <WhyCard n="02" title="Hear from Operators" body="Real-world OT security programmes from energy and industry." />
          <WhyCard n="03" title="Benchmark Your Strategy" body="Compare maturity, governance and architecture with peers." />
          <div style={{ gridColumn: "span 3" }}>
            <ImageTile src={IMG.network} alt="Networking between delegates at an OT Security First summit" radius={28} minHeight={220}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, pointerEvents: "none", padding: 26, background: "linear-gradient(0deg,rgba(10,10,10,0.9),transparent)" }}>
                <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 19, letterSpacing: "-0.6px", color: "#fff", marginBottom: 6 }}>Build Strategic Relationships</div>
                <div style={{ fontFamily: FO, fontSize: 13.5, color: "rgba(255,255,255,0.6)" }}>CISOs · OT leaders · plant executives · authorities</div>
              </div>
            </ImageTile>
          </div>
          <div style={{ gridColumn: "span 3", borderRadius: 28, padding: "clamp(26px,2.6vw,38px)", background: TINT_CARD, border: "1px solid rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5),inset 0 -24px 40px -24px rgba(0,0,0,0.55),0 30px 56px -26px " + C + "99", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>05 · Practical Solutions</div>
            <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-1px", lineHeight: 1.15, color: "#fff", margin: "0 0 16px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>Visibility, segmentation, detection, response.</h3>
            <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.88)", margin: 0 }}>Technology showcases and boardroom demos across the OT stack.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="uae-card" style={{ gridColumn: "span 2", position: "relative", overflow: "hidden", borderRadius: 28, padding: "clamp(24px,2.4vw,34px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}>
      <span style={{ position: "absolute", top: -12, right: 14, fontFamily: FD, fontWeight: 800, fontSize: 86, lineHeight: 1, color: "rgba(255,255,255,0.035)" }}>{n}</span>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, marginBottom: 18 }} />
      <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 19, letterSpacing: "-0.6px", color: "#fff", margin: "0 0 10px" }}>{title}</h3>
      <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "#8E8E8E", margin: 0 }}>{body}</p>
    </div>
  );
}

// ─── 09 · THE QUESTION ───────────────────────────────────────────────────────
const CONVO: { n: string; label: string; body: string }[] = [
  { n: "01", label: "National Cyber Resilience", body: "CIIP policy is strengthening governance and baseline requirements." },
  { n: "02", label: "Industry 4.0", body: "AED 10 billion accelerating industrial growth and smart manufacturing." },
  { n: "03", label: "Digital Energy", body: "Energy and water infrastructure are increasingly data-driven." },
  { n: "04", label: "AI + Infrastructure", body: "AI, ML and robotics move closer to operational environments." },
  { n: "05", label: "IT/OT Convergence", body: "Cloud, remote access and IIoT dissolve traditional OT boundaries." },
  { n: "06", label: "Cyber-Physical Resilience", body: "Safe, continuous and resilient physical operations." },
];

function TheQuestion() {
  return (
    <section style={wrap}>
      <SectionHead num="09" label="The Conversation" note="One question" />

      {/* Split editorial — question set beside a portrait, giant quote mark */}
      <div className="uae-convo-top" style={{ display: "grid", gridTemplateColumns: "1.16fr 0.84fr", gap: "clamp(22px,3.4vw,56px)", alignItems: "stretch" }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "clamp(0px,1vw,8px)" }}>
          <svg aria-hidden width="86" height="66" viewBox="0 0 86 66" style={{ position: "absolute", top: "-6px", left: "-6px", opacity: 0.14 }}>
            <path d="M0 66V38C0 17 12 3 34 0l4 12C24 15 17 23 17 34h17v32zM52 66V38C52 17 64 3 86 0l4 12C76 15 69 23 69 34h17v32z" fill={C} />
          </svg>
          <h2 style={{ position: "relative", fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.4vw,66px)", letterSpacing: "-2.6px", lineHeight: 1.0, margin: "clamp(16px,2vw,26px) 0 clamp(22px,2.6vw,32px)", textWrap: "balance" }}>
            Are we protecting our{" "}
            <span style={{ background: `linear-gradient(100deg,${C_LIGHT} 0%,${C_BRIGHT} 46%,${C} 100%)`, ...CLIP }}>most critical systems</span>{" "}
            as aggressively as we protect our data?
          </h2>
          <div style={{ display: "flex", gap: 16, alignItems: "stretch", maxWidth: 560 }}>
            <span aria-hidden style={{ flexShrink: 0, width: 3, borderRadius: 2, background: `linear-gradient(180deg,${C_BRIGHT},${C_DEEP})` }} />
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(16px,1.7vw,22px)", letterSpacing: "-0.7px", lineHeight: 1.26, color: "rgba(255,255,255,0.9)", margin: 0 }}>Industrial environments will only become more connected. The question is how securely.</p>
          </div>
        </div>
        <ImageTile src={IMG.question} alt="Delegates in the main hall at OT Security First UAE" radius={30} minHeight="clamp(320px,32vw,460px)" pos="center">
          <span aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(155deg, transparent 42%, ${C}26 100%)` }} />
        </ImageTile>
      </div>

      {/* The six forces — left-rule editorial cards */}
      <div style={{ marginTop: "clamp(30px,3.4vw,52px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(18px,2.2vw,28px)" }}>
          <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "2.6px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Six forces shaping it</span>
          <span aria-hidden style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>
        <div className="uae-force-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "clamp(14px,1.5vw,20px)" }}>
          {CONVO.map((c) => (
            <div key={c.n} className="uae-force" style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: "clamp(22px,2vw,28px) clamp(22px,2vw,28px) clamp(22px,2vw,28px) clamp(26px,2.4vw,32px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW, transition: "border-color 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s" }}>
              <span aria-hidden className="uae-force-bar" style={{ position: "absolute", left: 0, top: "clamp(22px,2vw,28px)", bottom: "clamp(22px,2vw,28px)", width: 3, borderRadius: 2, background: `linear-gradient(180deg,${C_BRIGHT},${C_DEEP})`, transition: "top 0.45s cubic-bezier(0.16,1,0.3,1), bottom 0.45s cubic-bezier(0.16,1,0.3,1)" }} />
              <h3 className="uae-force-title" style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(17px,1.5vw,21px)", letterSpacing: "-0.6px", lineHeight: 1.16, color: "#fff", margin: "0 0 10px", transition: "color 0.4s ease" }}>{c.label}</h3>
              <p style={{ fontFamily: FO, fontSize: "clamp(13px,1.1vw,14.5px)", lineHeight: 1.62, color: "#8E8E8E", margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 10 · THE FOCUS ──────────────────────────────────────────────────────────
function TheFocus() {
  const layers = ["Cybersecurity", "Operational Technology", "Industrial Control Systems", "Critical Infrastructure", "National Resilience"];
  return (
    <section style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "clamp(28px,4vw,64px)", alignItems: "center" }}>
        <div>
          <SectionHead num="10" label="The Focus" />
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "-2px", lineHeight: 1.04, margin: "0 0 20px" }}>
            Not a broad cyber conference.<span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>One intersection, in depth.</span>
          </h2>
          <p style={{ fontFamily: FO, fontSize: 15, lineHeight: 1.7, color: "#8E8E8E", margin: 0, maxWidth: 460 }}>Technical, operational, regulatory and strategic realities of protecting industrial environments.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {layers.map((l, i) => {
            const last = i === layers.length - 1;
            const first = i === 0;
            return (
              <div key={l} style={{
                borderRadius: first ? "24px 24px 6px 6px" : last ? "6px 6px 24px 24px" : 6,
                padding: "22px 28px", fontFamily: FD, fontWeight: 800, fontSize: "clamp(16px,1.7vw,22px)", letterSpacing: "-0.5px", color: "#fff",
                background: last ? `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 45%,#8E2A64 100%)` : `linear-gradient(180deg,${C}3d,${C}0d)`,
                border: last ? "1px solid rgba(255,255,255,0.22)" : `1px solid ${C}52`,
                boxShadow: last ? "inset 0 1px 0 rgba(255,255,255,0.45),0 24px 44px -26px " + C + "99" : "inset 0 1px 0 rgba(255,255,255,0.16)",
              }}>{l}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKERS (coming soon) ──────────────────────────────────────────────────
function SpeakersComingSoon() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="speakers" ref={ref} style={wrap}>
      <SectionHead num="—" label="Speakers" note="Announcing soon" />
      <div style={{ position: "relative", borderRadius: 36, overflow: "hidden", border: `1px solid ${C}2e`, background: `radial-gradient(ellipse 70% 120% at 20% 0%, ${C}1f, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1),0 34px 70px -38px rgba(0,0,0,0.95)", padding: "clamp(40px,6vw,88px) clamp(24px,4vw,64px)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 18px", borderRadius: 9999, border: `1px solid ${C}4d`, background: `${C}14`, fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "2.4px", textTransform: "uppercase", color: C }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C, animation: "uaePulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite" }} />
            Coming Soon
          </span>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.4vw,58px)", letterSpacing: "-2.2px", lineHeight: 1.03, margin: "26px 0 16px" }}>
            The 2027 speaker faculty<span style={{ display: "block", color: "rgba(255,255,255,0.28)" }}>is being assembled.</span>
          </h2>
          <p style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.65, color: "rgba(255,255,255,0.7)", margin: "0 auto 30px", maxWidth: 620 }}>
            Regulators, CISOs, OT leaders and plant executives from across the UAE&rsquo;s critical infrastructure. Announcements roll out ahead of 27 January 2027.
          </p>
          <a href="#register" className="uae-cta-solid" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14, fontWeight: 600, padding: "15px 30px", borderRadius: 9999, background: C, color: INK }}>Register to be notified →</a>
        </motion.div>
        {/* Placeholder speaker tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginTop: 44, maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ aspectRatio: "3 / 4", borderRadius: 20, background: "linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.012))", border: "1px dashed rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: "rgba(255,255,255,0.09)" }}>?</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PAST SERIES SPONSORS MARQUEE ────────────────────────────────────────────
const MARQUEE_ROW_1 = [
  `${S3_LOGOS}/paloalto.png`, `${S3_LOGOS}/fortinet.png`, `${S3_LOGOS}/Claroty.png`, `${S3_LOGOS}/Dragos.png`,
  `${S3_LOGOS}/nozomi-networks.png`, `${S3_LOGOS}/Tenable-logo.png`, `${S3_LOGOS}/kaspersky.png`, `${S3_LOGOS}/sentinelone.png`,
  `${S3_LOGOS}/Microsoft_logo.png`, `${S3_LOGOS}/Google-Cloud-Security.png`, `${S3_LOGOS}/Sonicwall.png`, `${S3_LOGOS}/threatlocker.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`, `${S3_LOGOS}/Xage.png`, `${S3_LOGOS}/corelight.png`,
];
const MARQUEE_ROW_2 = [
  `${S3_LOGOS}/Oracle.png`, `${S3_LOGOS}/EY.png`, `${S3_LOGOS}/Group-IB.png`, `${S3_LOGOS}/Acronis.png`,
  `${S3_LOGOS}/ManageEngine.png`, `${S3_LOGOS}/Wallix.png`, `${S3_LOGOS}/PENTERA.png`, `${S3_LOGOS}/Akamai.png`,
  `${S3_LOGOS}/secureworks.png`, `${S3_LOGOS}/filigran.png`, `${S3_LOGOS}/Anomali.png`, `${S3_LOGOS}/AmiViz.png`,
  `${S3_LOGOS}/GBM.png`, `${S3_LOGOS}/Paramount.png`, `${S3_LOGOS}/YOKOGAWA.png`,
];

function MarqueeRow({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div className={`uae-marquee-track is-${direction}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="uae-marquee-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={`${logo.split("/").pop()?.replace(/\.(png|jpg|svg|webp)$/i, "").replace(/[-_]/g, " ")} — past sponsor/partner of the OT Security First industrial cybersecurity series`} width={160} height={64} loading="lazy" decoding="async" style={{ maxHeight: 64, maxWidth: 160, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PastSponsorsMarquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", zIndex: 1, padding: "clamp(42px,4.6vw,66px) 0", background: BG, overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto 40px", padding: "0 clamp(24px,5vw,80px)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C}4d)` }} />
          <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: C_BRIGHT }}>Past Series Sponsors & Partners</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}4d, transparent)` }} />
        </motion.div>
      </div>
      <MarqueeRow logos={MARQUEE_ROW_1} direction="left" />
      <div style={{ height: 16 }} />
      <MarqueeRow logos={MARQUEE_ROW_2} direction="right" />
    </section>
  );
}

// ─── 11 · PARTNER ────────────────────────────────────────────────────────────
function Partner() {
  const tiers = ["Strategic Government", "Lead Industry", "OT Cybersecurity Technology", "Energy & Utilities", "Knowledge", "Networking", "Technology Showcases"];
  return (
    <section id="partner" style={wrap}>
      <SectionHead num="11" label="Why Partner" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: "clamp(20px,3vw,44px)", alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.6vw,52px)", letterSpacing: "-2px", lineHeight: 1.03, margin: "0 0 20px" }}>At the centre of the UAE&rsquo;s industrial cybersecurity conversation.</h2>
          <p style={{ fontFamily: FO, fontSize: 15, lineHeight: 1.7, color: "#8E8E8E", margin: "0 0 26px", maxWidth: 440 }}>Direct engagement with senior decision-makers across critical infrastructure.</p>
          <a href="#register" className="uae-cta-solid" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14, fontWeight: 600, padding: "15px 30px", borderRadius: 9999, background: `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 45%,${C_DEEP} 100%)`, border: "1px solid rgba(255,255,255,0.2)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45),0 14px 30px -14px ${C}bf`, color: INK }}>Request the partnership pack →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {tiers.map((t, i) => {
            const last = i === tiers.length - 1;
            return (
              <div key={t} className={last ? undefined : "uae-card"} style={{ borderRadius: 24, padding: 24, fontFamily: FD, fontWeight: 700, fontSize: 15.5, letterSpacing: "-0.3px", lineHeight: 1.35, color: last ? INK : "#fff", background: last ? `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 45%,${C_DEEP} 100%)` : "linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.012))", border: last ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.09)", boxShadow: last ? `inset 0 1px 0 rgba(255,255,255,0.45),0 24px 44px -26px ${C}99` : "inset 0 1px 0 rgba(255,255,255,0.1),0 20px 40px -30px rgba(0,0,0,0.9)" }}>{t}</div>
            );
          })}
        </div>
      </div>
      <div className="uae-partner-imgs" style={{ marginTop: "clamp(20px,3vw,44px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(14px,1.5vw,20px)" }}>
        <ImageTile src={IMG.partner} alt="Technology showcase and exhibition at an OT Security First summit" minHeight="clamp(240px,24vw,340px)" />
        <ImageTile src={`${OT_UAE}/4N8A0817.JPG`} alt="Delegates and partners at an OT Security First summit" minHeight="clamp(240px,24vw,340px)" />
      </div>
    </section>
  );
}

// ─── COMMUNITY QUOTE ─────────────────────────────────────────────────────────
function Community() {
  return (
    <section style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px) clamp(48px,6vw,90px)" }}>
      <div style={{ borderRadius: 36, padding: "clamp(32px,4.5vw,64px)", background: `radial-gradient(ellipse 60% 90% at 90% 10%, ${C}29, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))`, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 34px 70px -38px rgba(0,0,0,0.95)" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(26px,3.4vw,48px)", letterSpacing: "-1.8px", lineHeight: 1.05, margin: "0 0 28px" }}>Government <span style={{ color: C }}>×</span> Industry <span style={{ color: C }}>×</span> Technology</h2>
        <div style={{ paddingLeft: 28, borderLeft: `2px solid ${C}`, maxWidth: 820 }}>
          <p style={{ fontFamily: FDM, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,2.2vw,28px)", lineHeight: 1.45, letterSpacing: "-0.3px", color: "#fff", margin: 0 }}>Cybersecurity must protect not only information — but the physical systems, processes and people that keep society and industry operating.</p>
        </div>
      </div>
    </section>
  );
}

// ─── REGISTER (shared InquiryForm) ───────────────────────────────────────────
function RegisterSection() {
  return (
    <section id="register" style={{ position: "relative", zIndex: 1, padding: "clamp(42px,4.6vw,66px) 0", background: BG, overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 55% 50% at 50% 0%, ${C}14 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 80% 100%, ${C}0f 0%, transparent 70%)` }} />
      <div className="uae-register-wrap" style={{ position: "relative", zIndex: 1 }}>
        <InquiryForm
          defaultCountry="AE"
          eventName="OT Security First UAE 2027"
          labelText="Request an Invitation"
        />
      </div>
      <style jsx global>{`
        .uae-register-wrap #get-involved { background: transparent !important; }
        .uae-register-wrap #get-involved > .absolute { display: none; }
        .uae-register-wrap .inquiry-split > div:last-child {
          background: rgba(10,10,10,0.78) !important;
          backdrop-filter: blur(28px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(28px) saturate(1.2) !important;
          border: 1px solid ${C}25 !important;
          box-shadow: 0 22px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
      `}</style>
    </section>
  );
}

// ─── AGENDA ADVISORY & SPEAKING OPPORTUNITIES (Anna / Hassan / Mayur) ─────────
function ContactCard({ delay, eyebrow, name, role, photo, email, whatsapp, inView, photoPos, photoTransform }: { delay: number; eyebrow: string; name: string; role: string; photo: string; email: string; whatsapp: string; inView: boolean; photoPos?: string; photoTransform?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay, ease: EASE }}
      style={{ position: "relative", borderRadius: 22, border: `1.5px solid ${C}66`, background: "linear-gradient(180deg, rgba(20,14,20,0.85) 0%, rgba(10,10,10,0.96) 100%)", boxShadow: `0 28px 60px ${C}30, 0 0 50px ${C_BRIGHT}15, inset 0 1px 0 rgba(255,255,255,0.05)`, overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <span style={{ position: "absolute", top: 18, left: 18, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 999, background: "rgba(10,10,10,0.78)", border: `1px solid ${C_BRIGHT}66`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", fontFamily: FO, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: C_BRIGHT }}>
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
        {eyebrow}
      </span>
      <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={`${name}, ${role} at Events First Group — contact for OT Security First UAE 2027`} width={420} height={560} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: photoPos || "center 18%", transform: photoTransform || undefined }} />
        <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", background: "linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.98) 100%)", pointerEvents: "none" }} />
      </div>
      <div style={{ position: "relative", marginTop: -84, padding: "0 22px 22px", zIndex: 2 }}>
        <h3 style={{ fontFamily: FD, fontSize: "clamp(22px,2vw,28px)", fontWeight: 800, letterSpacing: "-1px", color: "white", margin: 0, lineHeight: 1.1, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{name}</h3>
        <div style={{ fontFamily: FO, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.6)", margin: "8px 0 18px" }}>{role}</div>
        <div className="uae-contact-pills">
          <a href={`mailto:${email}`} className="uae-contact-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, fontFamily: FO, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>Email</a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="uae-contact-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, fontFamily: FO, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>WhatsApp</a>
        </div>
      </div>
    </motion.div>
  );
}

function AdvisorySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} id="register-interest" style={{ position: "relative", zIndex: 1, padding: "clamp(42px,4.6vw,66px) 0", background: BG }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 55% 50% at 50% 0%, ${C}12 0%, transparent 65%)` }} />
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(24px,5vw,80px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{ width: 26, height: 1, background: C }} />
          <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: C_BRIGHT }}>Agenda Advisory &amp; Speaking Opportunities</span>
          <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)" }} />
        </div>
        <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1, ease: EASE }} style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(34px,5vw,64px)", letterSpacing: "-2.2px", lineHeight: 0.98, color: "white", margin: "0 0 20px", maxWidth: 880 }}>
          Shape the conversation &mdash;{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C }}>start it here.</em>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.18, ease: EASE }} style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", fontWeight: 400, lineHeight: 1.55, color: "rgba(255,255,255,0.78)", margin: "0 0 44px", maxWidth: 680 }}>
          Real people, ready to help you with speaking and sponsorship enquiries.
        </motion.p>
        <div className="uae-contact-split" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(20px,2.4vw,32px)", alignItems: "stretch" }}>
          <ContactCard delay={0.2} eyebrow="Speaking" name="Anna Firdouse Shah" role="Senior Conference Producer" photo={`${S3}/team/anna+blur+bg.png`} photoPos="center center" photoTransform="scale(1.4) translateX(-12%)" email="anna@eventsfirstgroup.com" whatsapp="https://wa.me/971545714377" inView={inView} />
          <ContactCard delay={0.32} eyebrow="Sponsorship" name="Mohammed Hassan" role="Partnership Manager" photo={`${S3}/about-us-photos/hassan.jpg`} email="hassan@eventsfirstgroup.com" whatsapp="https://wa.me/971545714377" inView={inView} />
          <ContactCard delay={0.44} eyebrow="Sponsorship" name="Mayur Methi" role="Partnership Manager" photo={`${S3}/about-us-photos/Mayur-Methi.png`} email="mayur@eventsfirstgroup.com" whatsapp="https://wa.me/971545714377" inView={inView} />
        </div>
      </div>
    </section>
  );
}

// ─── 12 · FROM THE ROOM (OT testimonial shorts) ──────────────────────────────
const OT_SHORTS = ["Q0n_sVaMnxg", "SF87voLk34A", "R5dtc5kjiQU", "Hm_yj3NttPo", "aaG9We6AjY8"];

function RoomShort({ videoId, index }: { videoId: string; index: number }) {
  const [playing, setPlaying] = useState(false);
  const isHero = index === 2;
  const edge = index === 0 || index === 4;
  const w = isHero ? "clamp(180px,17vw,240px)" : edge ? "clamp(140px,13vw,190px)" : "clamp(155px,14.5vw,215px)";
  const h = isHero ? "clamp(310px,28vw,420px)" : edge ? "clamp(225px,20vw,310px)" : "clamp(265px,24vw,365px)";
  return (
    <div style={{ width: w, height: h, flexShrink: 0, padding: 3, borderRadius: 22, background: isHero ? `linear-gradient(160deg, ${C_BRIGHT}66 0%, ${C}33 40%, rgba(255,255,255,0.06) 75%, ${C}22 100%)` : `linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 45%, ${C}1a 100%)`, boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)" }}>
      <div
        onClick={() => !playing && setPlaying(true)}
        role={playing ? undefined : "button"}
        tabIndex={playing ? undefined : 0}
        onKeyDown={(e) => { if (!playing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setPlaying(true); } }}
        style={{ position: "relative", width: "100%", height: "100%", borderRadius: 19, overflow: "hidden", background: "#050505", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.5)", cursor: playing ? "default" : "pointer" }}
      >
        {playing ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title="OT Security First testimonial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="OT Security First testimonial from an OT cybersecurity leader" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%" }} />
            <div style={{ position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 9px", borderRadius: 999, background: "rgba(6,6,6,0.55)", border: `1px solid ${C}45`, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
              <span style={{ fontFamily: FO, fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>No. {String(index + 1).padStart(2, "0")}</span>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="uae-room-play" style={{ width: isHero ? 60 : 50, height: isHero ? 60 : 50, borderRadius: "50%", background: "rgba(255,255,255,0.92)", boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s" }}>
                <svg width={isHero ? 20 : 16} height={isHero ? 20 : 16} viewBox="0 0 16 18" fill={C}><path d="M14 9L2 17V1L14 9Z" /></svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FromTheRoom() {
  return (
    <section style={{ ...wrap, contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}>
      <SectionHead num="12" label="From the Room" note="Testimonials" />
      <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,58px)", letterSpacing: "-2.2px", lineHeight: 1.0, margin: "0 0 14px", textWrap: "balance" }}>
        Hear it straight{" "}
        <span style={{ background: `linear-gradient(100deg,${C_LIGHT} 0%,${C_BRIGHT} 46%,${C} 100%)`, ...CLIP }}>from the room.</span>
      </h2>
      <p style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.65, color: "#8E8E8E", margin: "0 0 clamp(34px,4vw,52px)", maxWidth: 560 }}>Unfiltered voices from the OT security leaders who have walked the floor of OT Security First.</p>
      <div className="uae-room-row">
        {OT_SHORTS.map((id, i) => <RoomShort key={id} videoId={id} index={i} />)}
      </div>
    </section>
  );
}

// ─── 13 · GALLERY (mosaic — OT UAE photography) ───────────────────────────────
const GALLERY: { src: string; size: "lg" | "wide" | "tall" | "sm" }[] = [
  { src: `${OT_UAE}/4N8A0475.JPG`, size: "lg" },
  { src: `${OT_UAE}/4N8A0480.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0490.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0650.JPG`, size: "wide" },
  { src: `${OT_UAE}/4N8A0470.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0550.JPG`, size: "tall" },
  { src: `${OT_UAE}/4N8A0446.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0750.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0856.JPG`, size: "wide" },
  { src: `${OT_UAE}/4N8A0850.JPG`, size: "lg" },
  { src: `${OT_UAE}/4N8A0448.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0420.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0476.JPG`, size: "sm" },
  { src: `${OT_UAE}/4N8A0817.JPG`, size: "sm" },
];

function Gallery() {
  return (
    <section style={{ ...wrap, contentVisibility: "auto", containIntrinsicSize: "auto 900px" }}>
      <SectionHead num="13" label="Gallery" note="Abu Dhabi" />
      <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,58px)", letterSpacing: "-2.2px", lineHeight: 1.0, margin: "0 0 14px", textWrap: "balance" }}>
        Inside the{" "}
        <span style={{ background: `linear-gradient(100deg,${C_LIGHT} 0%,${C_BRIGHT} 46%,${C} 100%)`, ...CLIP }}>OT Security First</span>{" "}experience.
      </h2>
      <p style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.65, color: "#8E8E8E", margin: "0 0 clamp(30px,3.6vw,48px)", maxWidth: 560 }}>Moments captured across the OT Security First UAE edition.</p>
      <div className="uae-gallery-grid">
        {GALLERY.map((g) => (
          <div key={g.src} className={`uae-gallery-tile uae-g-${g.size}`}>
            <Image src={g.src} alt="OT Security First UAE summit moment" fill sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} />
            <span aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(160deg, transparent 58%, ${C}1c 100%)` }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function OTUaePage() {
  return (
    <main style={{ background: BG, color: "#fff", fontFamily: FO, fontWeight: 300, position: "relative", overflowX: "hidden" }}>
      <AmbientBg />
      <EventNavigation />
      <Hero />
      <StatPlates />
      <TheEvent />
      <WhyAbuDhabi />
      <TheMandate />
      <SpeakersComingSoon />
      <PastSponsorsMarquee />
      <MarketDrivers />
      <KeyThemes />
      <WhoAttends />
      <Industries />
      <WhyAttend />
      <TheQuestion />
      <TheFocus />
      <Partner />
      <FromTheRoom />
      <Gallery />
      <Community />
      <RegisterSection />
      <AdvisorySection />
      <Footer />

      <style jsx global>{`
        @keyframes uaePulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }
        @keyframes uaeHeroShine { 0% { transform: translateX(-160%) skewX(-18deg); } 55%, 100% { transform: translateX(520%) skewX(-18deg); } }
        .uae-hero-shine { position: absolute; top: 0; bottom: 0; left: 0; width: 32%; z-index: 2; pointer-events: none; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.32), transparent); transform: translateX(-160%) skewX(-18deg); animation: uaeHeroShine 5.5s cubic-bezier(0.16,1,0.3,1) infinite; }
        @media (prefers-reduced-motion: reduce) { .uae-hero-shine { animation: none; opacity: 0; } }
        @keyframes uaeMarqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes uaeMarqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .uae-marquee-track { display: flex; width: max-content; will-change: transform; }
        .uae-marquee-track.is-left { animation: uaeMarqueeLeft 35s linear infinite; }
        .uae-marquee-track.is-right { animation: uaeMarqueeRight 35s linear infinite; }
        .uae-marquee-item { flex-shrink: 0; height: 80px; width: 180px; margin-right: 40px; display: flex; align-items: center; justify-content: center; opacity: 0.55; }
        .uae-card { transition: border-color 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .uae-card:hover { border-color: ${C}66 !important; transform: translateY(-2px); }
        .uae-industry:hover { border-color: ${C}8c !important; background: linear-gradient(135deg, ${C}4d 0%, ${C}1f 55%, ${C}33 100%) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 18px 40px -18px ${C} !important; transform: translateY(-3px); }
        .uae-force:hover { border-color: ${C}66 !important; transform: translateY(-4px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 26px 52px -28px rgba(0,0,0,0.95), 0 0 0 1px ${C}22 !important; }
        .uae-force:hover .uae-force-bar { top: 0; bottom: 0; }
        .uae-force:hover .uae-force-title { color: ${C_LIGHT}; }
        @media (max-width: 940px) { .uae-force-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; } }
        @media (max-width: 820px) { .uae-convo-top { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .uae-force-grid { grid-template-columns: 1fr !important; } .uae-partner-imgs { grid-template-columns: 1fr !important; } }
        .uae-room-row { display: flex; flex-wrap: nowrap; gap: clamp(10px,1.2vw,18px); align-items: center; justify-content: center; }
        .uae-room-row > div:hover .uae-room-play { transform: scale(1.09); background: #fff; }
        @media (max-width: 1024px) { .uae-room-row { overflow-x: auto; justify-content: flex-start; -webkit-overflow-scrolling: touch; padding-bottom: 6px; } .uae-room-row::-webkit-scrollbar { display: none; } }
        .uae-gallery-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: clamp(96px,9vw,132px); grid-auto-flow: dense; gap: clamp(8px,1vw,12px); }
        .uae-gallery-tile { position: relative; overflow: hidden; border-radius: 16px; border: 1px solid rgba(255,255,255,0.09); background: #050505; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 18px 40px -28px rgba(0,0,0,0.95); }
        .uae-gallery-tile img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .uae-gallery-tile:hover img { transform: scale(1.06); }
        .uae-g-lg { grid-column: span 2; grid-row: span 2; }
        .uae-g-wide { grid-column: span 2; grid-row: span 1; }
        .uae-g-tall { grid-column: span 1; grid-row: span 2; }
        .uae-g-sm { grid-column: span 1; grid-row: span 1; }
        @media (max-width: 760px) { .uae-gallery-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: clamp(110px,26vw,150px); } .uae-g-wide { grid-column: span 2; } .uae-g-lg { grid-column: span 2; grid-row: span 2; } }
        .uae-q:hover { border-color: ${C}73 !important; transform: translateY(-1px); }
        .uae-cta-solid { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s; }
        .uae-cta-solid::before { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 38%; z-index: 0; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent); transform: translateX(-180%) skewX(-18deg); transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); pointer-events: none; }
        .uae-cta-solid:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 16px 40px -12px ${C}, 0 0 0 1px ${C}55; }
        .uae-cta-solid:hover::before { transform: translateX(360%) skewX(-18deg); }
        .uae-cta-arrow { display: inline-block; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
        .uae-cta-solid:hover .uae-cta-arrow { transform: translateX(5px); }
        .uae-cta-ghost { transition: border-color 0.35s, color 0.35s, background 0.35s, transform 0.35s; }
        .uae-cta-ghost:hover { border-color: ${C}99 !important; color: ${C_LIGHT} !important; background: ${C}1f !important; transform: translateY(-2px); }
        .uae-sector { transition: border-color 0.3s ease, background 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .uae-sector:hover { border-color: ${C}66; background: ${C}1c; color: #fff; transform: translateY(-2px); }
        .uae-plate { transition: transform 0.45s cubic-bezier(0.16,1,0.3,1); }
        .uae-plate:hover { transform: translateY(-5px); }
        .uae-video-play { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, border-color 0.4s; }
        .uae-video-btn:hover .uae-video-play { transform: translate(-50%,-50%) scale(1.09); background: ${C}; border-color: rgba(255,255,255,0.65); box-shadow: 0 14px 50px -6px ${C}; }
        .uae-driver { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .uae-driver:hover { transform: translateY(-4px); }
        .uae-driver-tab { transition: width 0.5s cubic-bezier(0.16,1,0.3,1); }
        .uae-driver:hover .uae-driver-tab { width: 100%; }
        .uae-driver-dot { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .uae-driver:hover .uae-driver-dot { transform: scale(1.5); }
        .uae-cohort:hover .uae-cohort-idx { color: ${C}; }
        .uae-cohort-role:hover { border-color: ${C}66 !important; color: ${C_LIGHT} !important; background: ${C}18 !important; }
        @media (max-width: 820px) {
          .uae-event-grid { grid-template-columns: 1fr !important; }
          .uae-ad-grid { grid-template-columns: 1fr !important; }
          .uae-attend-lead { grid-template-columns: 1fr !important; }
          .uae-cohort { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 640px) {
          .uae-ad-quote { white-space: normal !important; }
        }
        @media (max-width: 760px) {
          .uae-mandate-grid { grid-template-columns: 1fr !important; column-gap: 0 !important; }
        }
        @media (max-width: 940px) {
          .uae-drivers-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
        @media (max-width: 1100px) {
          .uae-theme-hero-title { white-space: normal !important; }
        }
        @media (max-width: 600px) {
          .uae-drivers-grid { grid-template-columns: 1fr !important; }
        }
        .uae-link:hover { color: ${C} !important; }
        .uae-contact-pills { display: flex; flex-direction: row; gap: 10px; align-items: center; flex-wrap: wrap; }
        .uae-contact-pill { transition: background 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, color 0.35s, transform 0.35s; }
        .uae-contact-pill:hover { background: ${C}18 !important; border-color: ${C}55 !important; color: ${C_LIGHT} !important; transform: translateY(-1px); }
        @media (max-width: 1100px) {
          .uae-bento { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .uae-bento > * { grid-column: span 1 !important; }
        }
        @media (max-width: 700px) {
          .uae-bento { grid-template-columns: 1fr !important; }
          .uae-bento > * { grid-column: auto !important; }
        }
        @media (max-width: 880px) {
          .uae-contact-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 820px) {
          .uae-hero-meta { flex-wrap: wrap !important; }
          .uae-hero-cta { margin-left: 0 !important; width: 100%; }
        }
        @media (max-width: 460px) {
          .uae-hero-cta { flex-direction: column; }
          .uae-hero-cta > a { justify-content: center; width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .uae-marquee-track { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
