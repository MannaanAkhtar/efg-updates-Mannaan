"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import SeriesTickerBar from "@/components/ui/SeriesTickerBar";

// ─── Series-page design tokens (violet accent) ───────────────────────────────
const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const INK = "#050608";
const MUTE = "rgba(255,255,255,0.58)";
const FAINT = "rgba(255,255,255,0.36)";
const RULE = "rgba(255,255,255,0.08)";
const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_IMG = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/opex_first.png";

const heroStats = [
  { value: 3, suffix: "", label: "Editions" },
  { value: 2, suffix: "", label: "Countries" },
  { value: 400, suffix: "+", label: "Delegates" },
  { value: 60, suffix: "+", label: "Speakers" },
];

// Ambient motes, confined to the right two-thirds so they never clutter the slab
const MOTES = [
  { l: 52, s: 3, d: 0, dur: 16 }, { l: 63, s: 2, d: 4, dur: 20 },
  { l: 72, s: 4, d: 7, dur: 14 }, { l: 80, s: 2, d: 2, dur: 22 },
  { l: 88, s: 3, d: 5.5, dur: 17 }, { l: 94, s: 2, d: 9, dur: 19 },
  { l: 58, s: 2, d: 6.5, dur: 21 }, { l: 76, s: 3, d: 1.2, dur: 15 },
];

export default function OpexHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  }, []);
  const onLeave = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  }, []);

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 14, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay: 0.5 + i * 0.09, ease: EASE },
  });

  return (
    <section ref={sectionRef} onMouseMove={onMove} onMouseLeave={onLeave} className="relative w-full overflow-hidden opex-hero"
      style={{ minHeight: "100svh", background: INK, ["--px" as string]: 0, ["--py" as string]: 0 }}>

      {/* ── Command wall (parallax + Ken Burns) ── */}
      <div className="absolute inset-0 opex-bg-parallax">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="" className="opex-bg-img" />
      </div>

      {/* Left legibility vignette + violet backlight bloom behind the slab */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, ${INK} 0%, rgba(5,6,8,0.6) 26%, transparent 48%)` }} />
      <div className="absolute inset-0 pointer-events-none opex-backlight" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(5,6,8,0.5), transparent 22%, transparent 76%, ${INK} 100%)` }} />

      {/* Ambient motes (right two-thirds) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {MOTES.map((m, i) => (
          <span key={i} className="opex-mote" style={{ left: `${m.l}%`, width: m.s, height: m.s, animationDelay: `${m.d}s`, animationDuration: `${m.dur}s` }} />
        ))}
      </div>

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity: 0.05, mixBlendMode: "soft-light" }} />

      {/* One-time light sweep (power-on) */}
      <span className="opex-sweep-once" aria-hidden />

      {/* Top caustic hairline */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${VIOLET}, transparent)` }} />

      {/* ── Content grid (slab left, wall breathes right) ── */}
      <div className="opex-grid">
        <motion.div className="opex-slab-wrap"
          initial={{ opacity: 0, scale: 0.965, y: 18, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE }}>
          <div className="opex-slab">
            <span aria-hidden className="opex-slab-lip" />

            {/* Badge */}
            <motion.div {...stagger(0)}>
              <span className="opex-badge">
                <span className="opex-badge-inner">
                  <span className="opex-pulse-dot" />
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.42em", textTransform: "uppercase", color: "#EDE7FA" }}>Opex First Series</span>
                </span>
              </span>
            </motion.div>

            {/* Luminous divider (the one glowing rule) */}
            <motion.span aria-hidden className="opex-divider" {...stagger(1)} />

            {/* Title */}
            <h1 className="opex-title">
              <motion.span className="opex-title-word opex-title-opex" {...stagger(2)}>Opex</motion.span>{" "}
              <motion.span className="opex-title-word opex-title-first" {...stagger(3)}>First</motion.span>
            </h1>

            {/* Tagline */}
            <motion.p className="opex-tagline" {...stagger(4)}>Where efficiency meets <span className="opex-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400 }}>excellence</span>.</motion.p>

            {/* Description */}
            <motion.p className="opex-desc" {...stagger(5)}>
              The dedicated summit series for operational excellence, business
              transformation, and process innovation.
            </motion.p>

            {/* CTAs */}
            <motion.div className="opex-cta-row" {...stagger(6)}>
              <Link
                href="#register"
                className="opex-cta opex-cta-primary"
                onClick={() => window.dispatchEvent(new CustomEvent("opex-register:tab", { detail: "attend" }))}
              >
                Reserve Your Seat<Arrow />
              </Link>
              <Link
                href="#register"
                className="opex-cta opex-cta-ghost"
                onClick={() => window.dispatchEvent(new CustomEvent("opex-register:tab", { detail: "sponsor" }))}
              >
                Become a Sponsor<Arrow />
              </Link>
            </motion.div>

            {/* Stats — recessed instrument sub-tray */}
            <motion.div className="opex-stats-tray" {...stagger(7)}>
              {heroStats.map((s, i) => (
                <div key={s.label} className="opex-stat">
                  <AnimatedStat {...s} />
                  {i < heroStats.length - 1 && <span aria-hidden className="opex-stat-div" />}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Ticker */}
      <SeriesTickerBar accentColor={VIOLET} eventName="OPEX First KSA" location="Riyadh, Saudi Arabia" targetDate={new Date("2026-10-21T09:00:00")} ctaText="View Event" ctaHref="/events/opex-first/saudi-2026" angularRadius={false} />

      {/* ── Styles ── */}
      <style jsx global>{`
        .opex-bg-parallax { transform: translate3d(calc(var(--px) * -22px), calc(var(--py) * -14px), 0); transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); will-change: transform; }
        .opex-bg-img { width: 100%; height: 100%; object-fit: cover; object-position: right center; filter: saturate(1.08) brightness(0.86) contrast(1.05); transform: scale(1.12); animation: opexKen 34s ease-in-out infinite alternate; }
        @keyframes opexKen { from { transform: scale(1.12) translate(0,0); } to { transform: scale(1.2) translate(-1.2%, -0.8%); } }

        .opex-backlight { background: radial-gradient(ellipse 48% 58% at 22% 48%, ${VIOLET}33, transparent 70%); animation: opexBloom 6.5s ease-in-out infinite; mix-blend-mode: screen; }
        @keyframes opexBloom { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

        .opex-mote { position: absolute; bottom: -6%; border-radius: 50%; background: radial-gradient(circle, ${VIOLET_BRIGHT}, transparent 70%); box-shadow: 0 0 8px ${VIOLET}88; opacity: 0; animation-name: opexMote; animation-timing-function: linear; animation-iteration-count: infinite; }
        @keyframes opexMote { 0% { transform: translateY(0); opacity: 0; } 14% { opacity: 0.7; } 86% { opacity: 0.4; } 100% { transform: translateY(-106vh); opacity: 0; } }

        .opex-sweep-once { position: absolute; inset: 0; z-index: 6; pointer-events: none; background: linear-gradient(105deg, transparent 34%, rgba(159,103,255,0.12) 50%, transparent 66%); background-size: 260% 100%; background-position: 130% 0; animation: opexSweepOnce 1.7s cubic-bezier(0.22,1,0.36,1) 0.2s 1 forwards; mix-blend-mode: screen; }
        @keyframes opexSweepOnce { from { background-position: 130% 0; } to { background-position: -60% 0; } }

        /* Grid */
        .opex-grid { position: relative; z-index: 5; min-height: 100svh; display: grid; grid-template-columns: minmax(clamp(470px, 42vw, 580px), 0.6fr) 1fr; align-items: center; padding: clamp(78px,9vh,104px) 0 clamp(74px,8.5vh,96px) clamp(32px, 6vw, 104px); }
        .opex-slab-wrap { max-width: 600px; will-change: transform, opacity, filter; }

        /* Slab (tier 1 glass) */
        .opex-slab {
          --slab-pad: clamp(24px, 2.7vw, 42px);
          position: relative; border-radius: 28px; padding: var(--slab-pad); overflow: hidden;
          background: linear-gradient(150deg, rgba(20,16,34,0.44) 0%, rgba(10,8,18,0.32) 55%, rgba(16,12,28,0.52) 100%);
          -webkit-backdrop-filter: blur(40px) saturate(1.6) brightness(1.05);
          backdrop-filter: blur(40px) saturate(1.6) brightness(1.05);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 40px 120px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 60px rgba(124,58,237,0.06);
          transform: perspective(1400px) rotateY(calc(var(--px,0) * 4deg)) rotateX(calc(var(--py,0) * -3deg)) translate3d(calc(var(--px,0) * -10px), calc(var(--py,0) * -6px), 0);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        /* Iridescent moving rim */
        .opex-slab::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 2;
          background: conic-gradient(from 210deg, transparent, rgba(159,103,255,0.4), transparent 28%, rgba(1,187,245,0.15) 42%, transparent 58%, rgba(159,103,255,0.45) 78%, transparent);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
        }
        /* Wet specular catch-light that rakes with the cursor */
        .opex-slab::after {
          content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; mix-blend-mode: screen;
          background: radial-gradient(120% 80% at calc(20% + var(--px,0) * 26%) calc(2% + var(--py,0) * 12%), rgba(255,255,255,0.13), transparent 60%);
        }
        .opex-slab-lip { position: absolute; top: 0; left: 8%; right: 8%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); opacity: 0.35; z-index: 3; }
        .opex-slab > * { position: relative; z-index: 4; }

        /* Badge (skeuomorphic metal bezel) */
        .opex-badge { display: inline-block; padding: 1.5px; border-radius: 999px; background: linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.4) 100%); box-shadow: 0 8px 22px rgba(0,0,0,0.4), 0 0 30px ${VIOLET}1f; }
        .opex-badge-inner { display: inline-flex; align-items: center; gap: 10px; padding: 8px 18px; border-radius: 999px; background: linear-gradient(180deg, rgba(12,10,20,0.82), rgba(5,6,10,0.9)); -webkit-backdrop-filter: blur(22px) saturate(1.6); backdrop-filter: blur(22px) saturate(1.6); box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.5); }
        .opex-pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff, ${VIOLET_BRIGHT} 55%, ${VIOLET}); box-shadow: 0 0 10px ${VIOLET}; animation: opexPulse 1.8s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes opexPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }

        .opex-divider { display: block; width: 84px; height: 1px; margin: 18px 0 0; background: linear-gradient(90deg, ${VIOLET_BRIGHT}, rgba(159,103,255,0.2) 60%, transparent); box-shadow: 0 0 12px rgba(124,58,237,0.5); position: relative; }
        .opex-divider::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; border-radius: 50%; background: ${VIOLET_BRIGHT}; box-shadow: 0 0 8px ${VIOLET}; }

        /* Title */
        .opex-title { margin: 14px 0 0; font-family: var(--font-display); font-size: clamp(46px, 5.2vw, 88px); letter-spacing: -0.045em; line-height: 0.92; }
        .opex-title-word { display: inline-block; }
        .opex-title-opex { font-weight: 200; color: #F4F1FB; text-shadow: 0 0 60px rgba(124,58,237,0.35); }
        .opex-title-first { font-weight: 300; font-style: italic; padding-right: 0.14em; margin-right: -0.14em; background: linear-gradient(105deg, #efe9fb 0%, ${VIOLET_BRIGHT} 42%, #ffffff 52%, ${VIOLET_BRIGHT} 68%, #efe9fb 100%); background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; filter: drop-shadow(0 0 40px rgba(124,58,237,0.5)); animation: opexShimmer 5s ease-in-out infinite; }
        @keyframes opexShimmer { 0% { background-position: 130% 0; } 45%,100% { background-position: -30% 0; } }

        .opex-tagline { margin: 14px 0 0; font-family: var(--font-display); font-size: clamp(16px, 1.6vw, 21px); font-weight: 300; color: rgba(255,255,255,0.84); letter-spacing: -0.01em; }
        .opex-accent-shimmer { color: ${VIOLET_BRIGHT}; text-shadow: 0 0 24px rgba(124,58,237,0.35); }
        .opex-desc { margin: 12px 0 0; max-width: 470px; font-family: var(--font-outfit); font-size: clamp(13.5px, 1vw, 15.5px); font-weight: 300; color: ${MUTE}; line-height: 1.6; }

        /* CTAs */
        .opex-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 22px; }
        .opex-cta { display: inline-flex; align-items: center; gap: 8px; padding: 12px 19px; border-radius: 999px; font-family: var(--font-outfit); font-size: 13px; font-weight: 500; cursor: pointer; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease; }
        .opex-cta-primary { position: relative; overflow: hidden; background: linear-gradient(135deg, ${VIOLET_BRIGHT}, ${VIOLET}); border: none; color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 30px rgba(124,58,237,0.35); }
        .opex-cta-primary::after { content: ""; position: absolute; top: 1px; left: 10%; right: 10%; height: 40%; border-radius: 999px 999px 60% 60%; background: linear-gradient(180deg, rgba(255,255,255,0.45), transparent); pointer-events: none; }
        .opex-cta-primary:hover { transform: translateY(-2px) scale(1.015); box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 16px 44px rgba(124,58,237,0.5); }
        .opex-cta-ghost { background: linear-gradient(165deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.88); -webkit-backdrop-filter: blur(16px) saturate(1.4); backdrop-filter: blur(16px) saturate(1.4); }
        .opex-cta-ghost:hover { transform: translateY(-2px); border-color: ${VIOLET}80; background: linear-gradient(165deg, ${VIOLET}26, rgba(255,255,255,0.02)); box-shadow: inset 0 0 20px rgba(124,58,237,0.1); }
        .opex-cta .opex-arrow { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .opex-cta:hover .opex-arrow { transform: translateX(3px); }

        /* Stats recessed sub-tray */
        .opex-stats-tray { display: flex; align-items: stretch; margin: clamp(20px,2.2vw,28px) calc(var(--slab-pad) * -1) calc(var(--slab-pad) * -1); padding: clamp(15px,1.7vw,20px) var(--slab-pad); background: rgba(6,5,12,0.5); -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); box-shadow: inset 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05); border-radius: 0 0 27px 27px; }
        .opex-stat { flex: 1; display: flex; align-items: center; position: relative; justify-content: flex-start; }
        .opex-stat-div { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 1px; height: 30px; background: linear-gradient(180deg, transparent, ${RULE} 30%, ${VIOLET}44 50%, ${RULE} 70%, transparent); }
        .opex-resource-item:hover { background: ${VIOLET}26 !important; }
        .opex-resource-item:focus-visible { outline: none; background: ${VIOLET}3a !important; }

        /* Responsive */
        @media (max-width: 900px) {
          .opex-grid { grid-template-columns: 1fr; align-items: center; padding: clamp(80px,10vh,100px) 14px clamp(76px,10vh,96px); }
          .opex-slab-wrap { max-width: 520px; margin: 0 auto; width: 100%; }
          /* Near-opaque dark slab so the busy wall never bleeds through the text */
          .opex-slab { -webkit-backdrop-filter: blur(18px) saturate(1.3); backdrop-filter: blur(18px) saturate(1.3); transform: none !important;
            background: linear-gradient(150deg, rgba(11,9,20,0.92) 0%, rgba(6,5,12,0.86) 55%, rgba(11,9,20,0.94) 100%); }
          .opex-slab::before { animation: none; }
          /* Dim + calmer slice of the wall behind everything */
          .opex-bg-img { object-position: 64% center; filter: saturate(1) brightness(0.5) contrast(1.05); }
          .opex-desc { color: rgba(255,255,255,0.78); }
          .opex-tagline { color: rgba(255,255,255,0.92); }
        }
        @media (max-width: 640px) {
          .opex-grid { padding: clamp(72px,8.5vh,88px) 12px clamp(72px,8.5vh,88px); }
          .opex-slab { --slab-pad: clamp(20px, 5vw, 28px); border-radius: 22px; }
          .opex-title { font-size: clamp(38px, 12vw, 54px); margin-top: 12px; }
          .opex-tagline { font-size: 15px; margin-top: 12px; }
          .opex-desc { font-size: 13.5px; max-width: 100%; margin-top: 11px; line-height: 1.55; }
          .opex-divider { margin-top: 14px; }
          .opex-cta-row { gap: 8px; margin-top: 18px; }
          .opex-cta, .opex-cta-row > div, .opex-cta-row > div > button { width: 100%; }
          .opex-cta { justify-content: center; padding: 11px 18px; font-size: 13px; }
          .opex-stats-tray { border-radius: 0 0 21px 21px; margin-top: clamp(16px,2vw,22px); padding: 14px var(--slab-pad); }
        }
        @media (max-width: 560px) {
          .opex-stat-div { display: none; }
          .opex-stats-tray { flex-wrap: wrap; row-gap: 16px; }
          .opex-stat { flex: 0 0 50%; }
        }
        @media (max-width: 400px) {
          .opex-title { font-size: clamp(32px, 11vw, 44px); }
          .opex-slab { --slab-pad: 18px; }
          .opex-badge-inner { padding: 7px 14px; }
          .opex-badge-inner span:last-child { font-size: 9.5px; letter-spacing: 0.34em; }
        }
        @media (pointer: coarse) { .opex-slab { transform: none !important; } }
        @media (prefers-reduced-motion: reduce) {
          .opex-bg-img, .opex-backlight, .opex-mote, .opex-sweep-once, .opex-title-first, .opex-accent-shimmer, .opex-pulse-dot, .opex-slab::before { animation: none !important; }
          .opex-slab { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

function Arrow() {
  return (
    <svg className="opex-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.round((1 - Math.pow(1 - progress, 4)) * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref} style={{ textAlign: "left" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 2.4vw, 32px)", fontWeight: 300, letterSpacing: "-0.02em", margin: 0, fontVariantNumeric: "tabular-nums", background: "linear-gradient(180deg, #ffffff 0%, rgba(210,196,240,0.72) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {displayValue.toLocaleString()}{suffix}
      </p>
      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: FAINT, marginTop: 5 }}>{label}</p>
    </div>
  );
}
