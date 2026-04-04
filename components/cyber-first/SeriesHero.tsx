"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import SeriesTickerBar from "@/components/ui/SeriesTickerBar";
import { NeuralConstellation } from "@/components/effects";

const C = "#01BBF5";
const C_BRIGHT = "#4DD4FF";
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const SPRING = { stiffness: 100, damping: 15 };
const KUWAIT_DATE = new Date("2026-06-09T09:00:00+03:00");

// ─── Edition Timeline ────────────────────────────────────────────────────────
const editions = [
  { id: "uae", label: "UAE", status: "completed", href: "/events/cyber-first" },
  { id: "kuwait", label: "Kuwait", status: "next", href: "/events/cyber-first/kuwait-2026" },
  { id: "india", label: "India", status: "upcoming", href: "/events/cyber-first/india-2026" },
  { id: "kenya", label: "Kenya", status: "upcoming", href: "/events/cyber-first/kenya-2026" },
  { id: "qatar", label: "Qatar", status: "upcoming", href: "/events/cyber-first/qatar-2026" },
  { id: "oman", label: "Oman", status: "upcoming", href: "/events/cyber-first/oman-2026" },
  { id: "ksa", label: "KSA", status: "upcoming", href: "/events/cyber-first/ksa-2026" },
];

// ─── Stats (for trust strip below hero) ──────────────────────────────────────
const stats = [
  { value: 1500, suffix: "+", label: "Security Leaders" },
  { value: 92, suffix: "%", label: "Director-Level+" },
  { value: 80, suffix: "+", label: "Speakers" },
  { value: 50, suffix: "+", label: "Sponsors" },
];

// ─── Countdown Hook ──────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

// ─── Spring Counter (for trust strip) ────────────────────────────────────────
function SpringCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => { if (inView) motionVal.set(target); }, [inView, target, motionVal]);
  useEffect(() => { const unsub = springVal.on("change", (v) => setDisplay(Math.round(v))); return unsub; }, [springVal]);

  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{display.toLocaleString()}{suffix}</span>;
}

// ─── Main Hero ───────────────────────────────────────────────────────────────
export default function SeriesHero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const cd = useCountdown(KUWAIT_DATE);

  return (
    <>
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "100vh", background: "#030508" }}>

        {/* Background event photo, very dimmed */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${S3}/Good/4N8A0122.JPG`} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.25) saturate(0.7)", objectPosition: "center 30%" }} />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.7) 45%, rgba(3,5,8,0.4) 100%)`, zIndex: 1 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(3,5,8,0.6) 0%, transparent 30%, transparent 60%, rgba(3,5,8,0.95) 100%)`, zIndex: 1 }} />

        {/* Cyan radial glow */}
        <div className="absolute pointer-events-none" style={{ top: "15%", right: "5%", width: "50%", height: "70%", background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${C}0A, transparent 70%)`, filter: "blur(80px)", zIndex: 2 }} />

        {/* Neural constellation */}
        <NeuralConstellation color={C} dotCount={30} connectionDistance={120} speed={0.12} opacity={0.04} />

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${C}03 1px, transparent 1px), linear-gradient(90deg, ${C}03 1px, transparent 1px)`, backgroundSize: "70px 70px", opacity: 0.35, zIndex: 2 }} />

        {/* Film grain */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, zIndex: 20, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />

        {/* Content */}
        <div className="cfh-split" style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", minHeight: "100vh", maxWidth: 1400, margin: "0 auto", padding: "100px clamp(24px, 4vw, 60px) 80px" }}>

          {/* ─── LEFT ─── */}
          <div className="cfh-left" style={{ flex: "0 0 45%", paddingRight: 48 }}>
            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", ...SPRING, delay: 0.1 }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ width: 32, height: 2, background: C, transformOrigin: "left", borderRadius: 1 }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: C }}>Cyber First Series</span>
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ width: 32, height: 2, background: C, transformOrigin: "right", borderRadius: 1 }} />
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...SPRING, delay: 0.2 }} style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 1, letterSpacing: "-0.04em", color: "white", margin: "0 0 12px" }}>
              Cyber First
            </motion.h1>

            {/* Subtitle */}
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...SPRING, delay: 0.3 }} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(20px, 2.5vw, 32px)", color: C_BRIGHT, margin: "0 0 18px", lineHeight: 1.2 }}>
              Where Top CISOs Convene
            </motion.h2>

            {/* Description */}
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...SPRING, delay: 0.4 }} style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.2vw, 16px)", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 420, marginBottom: 28 }}>
              The premier cybersecurity leadership summit series. Where CISOs, government cyber leaders, and security innovators shape regional strategy.
            </motion.p>

            {/* Edition Timeline */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...SPRING, delay: 0.5 }} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
              {editions.map((ed, i) => (
                <div key={ed.id} style={{ display: "flex", alignItems: "center" }}>
                  <Link href={ed.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none" }}>
                    <span style={{
                      width: ed.status === "next" ? 12 : 8, height: ed.status === "next" ? 12 : 8,
                      borderRadius: "50%",
                      background: ed.status === "completed" ? "rgba(255,255,255,0.3)" : ed.status === "next" ? C : `${C}40`,
                      boxShadow: ed.status === "next" ? `0 0 12px ${C}80, 0 0 24px ${C}40` : "none",
                      border: ed.status === "completed" ? "2px solid rgba(255,255,255,0.4)" : "none",
                      position: "relative",
                    }}>
                      {ed.status === "completed" && <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}><path d="M20 6L9 17l-5-5" /></svg>}
                    </span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: ed.status === "next" ? 700 : 500, letterSpacing: "1px", textTransform: "uppercase", color: ed.status === "next" ? C : ed.status === "completed" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{ed.label}</span>
                  </Link>
                  {i < editions.length - 1 && <span style={{ width: 20, height: 1, margin: "0 4px", background: i === 0 ? "rgba(255,255,255,0.2)" : `${C}20`, marginBottom: 18 }} />}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", ...SPRING, delay: 0.55 }} className="flex items-center gap-3 flex-wrap">
              <Link href="/events/cyber-first/kuwait-2026" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 50, background: C, color: "white", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: `0 4px 24px ${C}35`, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${C}50`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px ${C}35`; }}>
                Register for Kuwait 2026 <span>→</span>
              </Link>
              <Link href="/sponsors-and-partners" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 50, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                Become a Sponsor <span>→</span>
              </Link>
            </motion.div>
          </div>

          {/* ─── RIGHT: Cinematic Photo + Glass Card ─── */}
          <motion.div
            className="cfh-right"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* Photo container with parallax */}
            <motion.div style={{ y: photoY, width: "100%", maxWidth: 560, position: "relative" }}>
              {/* Main event photo */}
              <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", aspectRatio: "4/3", boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${C}06` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${S3}/Good/4N8A0160.JPG`} alt="Cyber First summit, 300+ executives" className="w-full h-full object-cover" style={{ filter: "brightness(0.7) saturate(1.1)" }} />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,5,8,0.85) 0%, rgba(3,5,8,0.3) 40%, transparent 70%)" }} />
                {/* Top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C}, ${C_BRIGHT}, ${C})`, opacity: 0.6 }} />
              </div>

              {/* Glass overlay card, bottom of photo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", ...SPRING, delay: 0.8 }}
                style={{
                  position: "absolute",
                  bottom: -24,
                  left: 20,
                  right: 20,
                  background: "rgba(6,10,18,0.8)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: `1px solid ${C}20`,
                  borderRadius: 14,
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 40px ${C}06`,
                }}
              >
                {/* Event info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C, boxShadow: `0 0 8px ${C}80` }} />
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C }}>Next Event</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "white" }}>Cyber First Kuwait</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>June 9, 2026</span>
                </div>

                {/* Countdown */}
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { v: cd.d, l: "D" }, { v: cd.h, l: "H" }, { v: cd.m, l: "M" }, { v: cd.s, l: "S" },
                  ].map((u, i) => (
                    <div key={u.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", minWidth: 36 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: C_BRIGHT, lineHeight: 1 }}>{String(u.v).padStart(2, "0")}</span>
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 7, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{u.l}</span>
                      </div>
                      {i < 3 && <span style={{ color: `${C}30`, fontSize: 14, fontWeight: 300 }}>:</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Ticker Bar */}
        <SeriesTickerBar
          accentColor={C}
          eventName="Cyber First Kuwait"
          location="Kuwait City, Kuwait"
          targetDate={KUWAIT_DATE}
          ctaText="Register →"
          ctaHref="/events/cyber-first/kuwait-2026"
        />

        {/* Responsive */}
        <style jsx global>{`
          @media (max-width: 1024px) {
            .cfh-split { flex-direction: column !important; padding-top: 100px !important; }
            .cfh-left { flex: none !important; padding-right: 0 !important; text-align: center !important; align-items: center !important; display: flex !important; flex-direction: column !important; margin-bottom: 40px !important; }
            .cfh-right { max-width: 500px !important; margin: 0 auto !important; }
          }
          @media (max-width: 640px) {
            .cfh-right { max-width: 100% !important; padding: 0 16px !important; }
          }
        `}</style>
      </section>

    </>
  );
}
