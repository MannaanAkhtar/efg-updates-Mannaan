"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import HeroSectionMobile from "./HeroSectionMobile";

// Lazy-load globe to avoid SSR issues with WebGL
const EFGGlobe = dynamic(() => import("@/components/ui/EFGGlobe"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const ORANGE = "#E8651A";
const NEXT_EVENT = { name: "Cyber First Kuwait", date: new Date("2026-06-09T09:00:00+03:00"), location: "Kuwait City" };

// ─── Countdown ───────────────────────────────────────────────────────────────
function CountdownDisplay({ date }: { date: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = date.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <div className="flex items-center gap-1">
      {[
        { v: t.d, l: "D" }, { v: t.h, l: "H" }, { v: t.m, l: "M" }, { v: t.s, l: "S" },
      ].map((u, i) => (
        <div key={u.l} className="flex items-center gap-1">
          <div className="flex items-baseline gap-0.5">
            <span className="tabular-nums" style={{ fontSize: 24, fontWeight: 700, color: "white", fontFamily: "var(--font-display)", minWidth: 32, textAlign: "center" }}>
              {String(u.v).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 11, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-outfit)", fontWeight: 600, letterSpacing: "0.06em" }}>{u.l}</span>
          </div>
          {i < 3 && <span style={{ color: `${ORANGE}40`, fontSize: 18 }}>:</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Main Hero ───────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <>
    {/* Mobile/Tablet: Original slideshow hero */}
    <div className="hero-mobile-view">
      <HeroSectionMobile />
    </div>

    {/* Desktop: Globe hero */}
    <section className="hero-desktop-view" style={{ position: "relative", height: "100vh", minHeight: 700, background: "#0A0A0A", overflow: "hidden" }}>

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, zIndex: 30, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />

      {/* Radial glow behind globe */}
      <div className="absolute pointer-events-none hero-globe-glow" style={{ top: "50%", right: "-5%", transform: "translateY(-50%)", width: "60%", height: "80%", background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${ORANGE}12, ${ORANGE}06 40%, transparent 70%)`, filter: "blur(40px)", zIndex: 1 }} />

      {/* Content container */}
      <div className="hero-split" style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", height: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 clamp(24px, 4vw, 60px)" }}>

        {/* ─── LEFT: Content ─── */}
        <div className="hero-left" style={{ flex: "0 0 42%", display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 32 }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ width: 28, height: 2, background: ORANGE, borderRadius: 1 }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: ORANGE }}>
                Premium Executive Summits
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: EASE }} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px, 4.5vw, 64px)", lineHeight: 1.08, letterSpacing: "-0.03em", color: "#F0F2F5", margin: "0 0 20px" }}>
            Where the Region&apos;s Top Decisions Are{" "}
            <span style={{ backgroundImage: `linear-gradient(110deg, ${ORANGE} 0%, #FFB547 50%, ${ORANGE} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "hero-shimmer 5s ease-in-out infinite" }}>
              Made.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: EASE }} style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(14px, 1.2vw, 16px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 440, marginBottom: 24 }}>
            Invite-only executive summits across the Middle East, Africa &amp; Asia. Bringing together CISOs, CDOs, and enterprise leaders who shape the future of technology.
          </motion.p>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.65, ease: EASE }} className="flex items-center gap-5 flex-wrap" style={{ marginBottom: 28 }}>
            {["Invite-Only Audiences", "CISO · CIO · CTO Focused", "8+ Nations"].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: ORANGE, boxShadow: `0 0 8px ${ORANGE}80` }} />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.03em" }}>{badge}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8, ease: EASE }} className="flex items-center gap-3 flex-wrap">
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 50, background: ORANGE, color: "white", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: `0 4px 24px ${ORANGE}35`, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${ORANGE}50`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px ${ORANGE}35`; }}>
              Explore Events <span>→</span>
            </Link>
            <Link href="/sponsors-and-partners" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 50, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}>
              Become a Partner
            </Link>
          </motion.div>
        </div>

        {/* ─── RIGHT: Globe ─── */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "visible" }}
        >
          <div style={{ width: "clamp(450px, 56vw, 820px)", position: "relative" }}>
            <EFGGlobe />
          </div>
        </motion.div>
      </div>

      {/* ─── Bottom Countdown Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.5, ease: EASE }}
        className="absolute bottom-0 left-0 right-0"
        style={{ zIndex: 20, background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="hero-bottom-bar flex items-center justify-between flex-wrap gap-4" style={{ maxWidth: 1400, margin: "0 auto", padding: "16px clamp(24px, 4vw, 60px)" }}>
          {/* Event info */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: ORANGE, opacity: 0.75 }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: ORANGE }} />
            </span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: ORANGE }}>Next Event</span>
            <span style={{ color: "rgba(255,255,255,0.12)", margin: "0 4px" }}>|</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>{NEXT_EVENT.name} · {NEXT_EVENT.location}</span>
          </div>

          {/* Countdown */}
          <CountdownDisplay date={NEXT_EVENT.date} />

          {/* Register link */}
          <Link
            href="/events"
            style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: ORANGE, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.3s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Register
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </motion.div>

      {/* CSS */}
      <style jsx global>{`
        @keyframes hero-shimmer {
          0%, 100% { background-position: 200% center; }
          50% { background-position: 0% center; }
        }
        .hero-mobile-view { display: none; }
        .hero-desktop-view { display: block; }
        @media (max-width: 1024px) {
          .hero-mobile-view { display: block !important; }
          .hero-desktop-view { display: none !important; }
        }
        @media (max-width: 640px) {
          .hero-bottom-bar { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 12px !important; }
        }
      `}</style>
    </section>
    </>
  );
}
