"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { NeuralConstellation, DotMatrixGrid } from "@/components/effects";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

const EASE = [0.16, 1, 0.3, 1] as const;
const PARTICLE_COUNT = 80;
const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:<>?/~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

type ComingSoonEventProps = {
  seriesName: string;
  eventTitle: string;
  color: string;
  colorBright: string;
  tagline: string;
  dateDisplay: string;
  location: string;
  edition?: string;
  eventDate: string;
};

// ─── Countdown Hook ──────────────────────────────────────────────────────────
function useCountdown(targetMs: number) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return t;
}

// ─── Particle Vortex (Canvas) ────────────────────────────────────────────────
function ParticleVortex({ color, colorBright }: { color: string; colorBright: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5,
      radiusX: 100 + Math.random() * 180,
      radiusY: 50 + Math.random() * 100,
      speed: 0.002 + Math.random() * 0.005,
      size: 1.2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
      tilt: Math.random() * Math.PI * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    const cw = canvas.offsetWidth / 2;
    const ch = canvas.offsetHeight / 2;

    const animate = () => {
      ctx.clearRect(0, 0, w / window.devicePixelRatio, h / window.devicePixelRatio);
      const time = Date.now() * 0.001;

      // Central glow
      const gradient = ctx.createRadialGradient(cw, ch, 0, cw, ch, 120);
      gradient.addColorStop(0, `${color}30`);
      gradient.addColorStop(0.4, `${color}12`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(cw - 140, ch - 140, 280, 280);

      particles.forEach((p) => {
        p.angle += p.speed;
        const wobble = Math.sin(time * 0.5 + p.phase) * 15;
        const x = cw + Math.cos(p.angle + p.tilt) * (p.radiusX + wobble);
        const y = ch + Math.sin(p.angle + p.tilt) * (p.radiusY + wobble * 0.5);
        const pulse = 0.6 + Math.sin(time * 2 + p.phase) * 0.4;

        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${colorBright}${Math.round(p.opacity * pulse * 15).toString(16).padStart(2, "0")}`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colorBright}${Math.round(p.opacity * pulse * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.ellipse(cw, ch, 180, 90, 0.15, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}10`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [color, colorBright]);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 550, height: 550, pointerEvents: "none", zIndex: 2, opacity: 0.9 }} />
  );
}

// ─── Text Scramble Effect ────────────────────────────────────────────────────
function ScrambleText({ text, color, colorBright }: { text: string; color: string; colorBright: string }) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const chars = text.split("");
    const resolved = new Array(chars.length).fill(false);
    const current = new Array(chars.length).fill("");

    // Initial delay before scramble starts
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        let allDone = true;
        for (let i = 0; i < chars.length; i++) {
          if (resolved[i]) { current[i] = chars[i]; continue; }
          allDone = false;
          current[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setDisplay(current.join(""));
        if (allDone) { clearInterval(interval); setDone(true); }
      }, 35);

      // Resolve characters one by one
      chars.forEach((_, i) => {
        setTimeout(() => { resolved[i] = true; }, 300 + i * 80);
      });

      return () => clearInterval(interval);
    }, 200);

    return () => clearTimeout(startDelay);
  }, [text]);

  return (
    <span style={{
      backgroundImage: done ? `linear-gradient(110deg, ${colorBright} 0%, #fff 50%, ${colorBright} 100%)` : "none",
      backgroundSize: "250% 100%",
      WebkitBackgroundClip: done ? "text" : "unset",
      WebkitTextFillColor: done ? "transparent" : colorBright,
      animation: done ? "shimmer-cs 5s ease-in-out infinite" : "none",
      transition: "all 0.3s ease",
    }}>
      {display || text}
    </span>
  );
}

// ─── Glossy Border Card (cursor-follow glow + 3D tilt) ───────────────────────
function GlossyCard({ children, color, colorBright, formCardRef }: { children: React.ReactNode; color: string; colorBright: string; formCardRef: React.RefObject<HTMLDivElement | null> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 25 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 25 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGlowPos({ x: x * 100, y: y * 100 });
    rotX.set((y - 0.5) * -10);
    rotY.set((x - 0.5) * 10);
  }, [rotX, rotY]);

  const handleLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={(el) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (formCardRef && 'current' in formCardRef) (formCardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      initial={{ opacity: 0, x: 50, scale: 0.93 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: EASE }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ width: "100%", position: "relative", perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <motion.div style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: "preserve-3d" }}>
        {/* Glossy border glow that follows cursor */}
        <div style={{
          position: "absolute", inset: -1, borderRadius: 21, zIndex: -1,
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${colorBright}45, transparent 60%)`,
          transition: "background 0.15s ease",
          opacity: 0.9,
        }} />
        {/* Animated sweep border */}
        <div style={{
          position: "absolute", inset: -1, borderRadius: 21, zIndex: -1,
          backgroundImage: `linear-gradient(90deg, ${color}00, ${colorBright}30, ${color}00, ${colorBright}20, ${color}00)`,
          backgroundSize: "300% 100%",
          animation: "border-glow-rotate 4s linear infinite",
          opacity: 0.5,
        }} />

        {/* Card body */}
        <div style={{
          background: "rgba(8,8,12,0.92)",
          backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
          border: `1px solid ${color}15`,
          borderRadius: 20, padding: "32px 28px",
          position: "relative", overflow: "hidden",
          boxShadow: `0 30px 100px rgba(0,0,0,0.5), 0 0 80px ${color}06`,
        }}>
          {/* Top shimmer line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${colorBright}35, transparent)` }} />
          {/* Inner glow */}
          <div className="absolute pointer-events-none" style={{ top: -60, left: "50%", transform: "translateX(-50%)", width: 250, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${color}12, transparent 70%)`, filter: "blur(40px)" }} />
          {/* Hover shine sweep */}
          <div className="cs-card-shine" style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: `linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)`, transform: "translateX(-100%)", transition: "transform 0.7s ease", pointerEvents: "none" }} />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ComingSoonEvent({
  seriesName, eventTitle, color, colorBright, tagline, dateDisplay, location, edition, eventDate,
}: ComingSoonEventProps) {
  const targetMs = useRef(new Date(eventDate).getTime()).current;
  const cd = useCountdown(targetMs);
  const sectionRef = useRef<HTMLElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  // Mouse glow
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const glowX = useTransform(springX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(springY, [0, 1], ["20%", "80%"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  // GSAP animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      if (blob1Ref.current) gsap.to(blob1Ref.current, { x: 80, y: -50, scale: 1.3, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      if (blob2Ref.current) gsap.to(blob2Ref.current, { x: -60, y: 40, scale: 0.8, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 });
      if (formCardRef.current) gsap.to(formCardRef.current, { y: -8, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, sectionRef);
    return () => ctx.revert();
  }, [mounted]);

  // Form
  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "", website: "" });
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!formData.name || !formData.email || !formData.company || !formData.phone) { setError("Please fill in all required fields."); return; }
    if (!isWorkEmail(formData.email)) { setError("Please use a work email address."); return; }
    const phoneErr = validatePhone(formData.phone, selectedCountry);
    if (phoneErr) { setError(phoneErr); return; }
    setSubmitting(true);
    try {
      await submitForm({ type: "attend", full_name: formData.name, email: formData.email, company: formData.company, phone: `${selectedCountry.code} ${formData.phone}`, event_name: eventTitle, website: formData.website });
      setSubmitted(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
    color: "white", fontFamily: "var(--font-outfit)", fontSize: 13, outline: "none",
    transition: "all 0.3s ease",
  };

  // Staggered field animation variants
  const fieldVariants = {
    hidden: { x: 30, opacity: 0, filter: "blur(4px)" },
    visible: (i: number) => ({ x: 0, opacity: 1, filter: "blur(0px)", transition: { delay: 0.8 + i * 0.1, type: "spring" as const, stiffness: 120, damping: 18 } }),
  };

  return (
    <div style={{ background: "#050505" }}>
      <style jsx global>{`
        .cs-select option { background: #111; color: #fff; }
        @keyframes shimmer-cs { 0%, 100% { background-position: 200% center; } 50% { background-position: 0% center; } }
        @keyframes scan-line { 0% { top: -2px; opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { top: 100%; opacity: 0; } }
        @keyframes border-glow-rotate { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes countdown-breathe {
          0%, 100% { box-shadow: 0 4px 20px ${color}08; }
          50% { box-shadow: 0 4px 30px ${color}22, 0 0 40px ${color}12; }
        }
        .cs-countdown-pill { animation: countdown-breathe 3s ease-in-out infinite; }
        .cs-countdown-pill:nth-child(2) { animation-delay: 0.4s; }
        .cs-countdown-pill:nth-child(3) { animation-delay: 0.8s; }
        .cs-countdown-pill:nth-child(4) { animation-delay: 1.2s; }
        .cs-card-shine-wrap:hover .cs-card-shine { transform: translateX(100%) !important; }
        .cs-cta-btn { position: relative; overflow: hidden; }
        .cs-cta-btn::after {
          content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.6s ease;
        }
        .cs-cta-btn:hover::after { transform: translateX(100%); }
        @media (max-width: 1024px) {
          .cs-split { height: auto !important; min-height: 100vh !important; }
          .cs-content-wrap { flex-direction: column !important; padding-top: 100px !important; padding-bottom: 80px !important; height: auto !important; }
          .cs-left { padding-right: 0 !important; text-align: center !important; align-items: center !important; margin-bottom: 40px !important; }
          .cs-right { flex: none !important; width: 100% !important; max-width: 420px !important; }
          .cs-divider { display: none !important; }
          .cs-countdown { justify-content: center !important; }
          .cs-pills { justify-content: center !important; }
          .cs-back-link { justify-content: center !important; }
          .cs-launch-label { text-align: center !important; }
        }
        @media (max-width: 640px) {
          .cs-content-wrap { padding: 90px 20px 60px !important; }
          .cs-headline { font-size: clamp(32px, 10vw, 48px) !important; }
          .cs-event-title { font-size: clamp(18px, 5vw, 26px) !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        className="cs-split"
        style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050505" }}
      >
        {/* ─── Atmospheric Layers ─── */}
        <NeuralConstellation color={color} dotCount={30} connectionDistance={120} speed={0.12} opacity={0.04} />
        <DotMatrixGrid color={color} opacity={0.01} spacing={50} />

        {/* Film grain */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, zIndex: 50, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />

        {/* (grid + scan line removed) */}

        {/* Mouse glow */}
        <motion.div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${color}10, transparent 70%)`, filter: "blur(80px)", left: glowX, top: glowY, transform: "translate(-50%, -50%)", zIndex: 1 }} />

        {/* Morphing blobs */}
        <div ref={blob1Ref} className="absolute pointer-events-none" style={{ top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${color}0C, transparent 60%)`, filter: "blur(100px)", zIndex: 1 }} />
        <div ref={blob2Ref} className="absolute pointer-events-none" style={{ bottom: "5%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${colorBright}08, transparent 60%)`, filter: "blur(90px)", zIndex: 1 }} />

        {/* ─── PARTICLE VORTEX ─── */}
        <ParticleVortex color={color} colorBright={colorBright} />

        {/* ─── Content Container ─── */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", width: "100%", maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 4vw, 60px)", height: "100%" }} className="cs-content-wrap">

          {/* ─── LEFT ─── */}
          <div className="cs-left" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 48 }}>
            {/* Series badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease: EASE }} style={{ marginBottom: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 18px", borderRadius: 30, background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}30` }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: colorBright, boxShadow: `0 0 12px ${colorBright}` }} />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: colorBright }}>
                  {seriesName}{edition ? ` · ${edition}` : ""}
                </span>
              </div>
            </motion.div>

            {/* Coming Soon — Text Scramble */}
            <h1 className="cs-headline" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 10px" }}>
              <ScrambleText text="Coming Soon" color={color} colorBright={colorBright} />
            </h1>

            {/* Accent line */}
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 1.2, ease: EASE }} style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${colorBright}, transparent)`, transformOrigin: "left", marginBottom: 14 }} />

            {/* Event title */}
            <motion.h2 className="cs-event-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.3, ease: EASE }} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px, 2.8vw, 30px)", color: colorBright, margin: "0 0 14px", lineHeight: 1.2 }}>
              {eventTitle}
            </motion.h2>

            {/* Tagline */}
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.4, ease: EASE }} style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(14px, 1.15vw, 15px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: 440, marginBottom: 24 }}>
              {tagline}
            </motion.p>

            {/* Date & Location pills */}
            <motion.div className="cs-pills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.5, ease: EASE }} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 50, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colorBright} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{dateDisplay}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 50, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colorBright} strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{location}</span>
              </div>
            </motion.div>

            {/* Countdown label */}
            <motion.span className="cs-launch-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.6, ease: EASE }} style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10, display: "block" }}>
              Launching In
            </motion.span>

            {/* Countdown */}
            <motion.div className="cs-countdown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.7, ease: EASE }} style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((u, i) => (
                <div key={u.l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="cs-countdown-pill" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 14px", borderRadius: 12, minWidth: 60, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: colorBright, lineHeight: 1, letterSpacing: "-1px" }}>{String(u.v).padStart(2, "0")}</span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 8, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginTop: 4 }}>{u.l}</span>
                  </div>
                  {i < 3 && <span style={{ color: `${color}40`, fontSize: 20, fontWeight: 300 }}>:</span>}
                </div>
              ))}
            </motion.div>

            {/* Back link */}
            <motion.div className="cs-back-link" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.9, ease: EASE }}>
              <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.3s ease", letterSpacing: "0.02em" }} onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                All Events
              </Link>
            </motion.div>
          </div>

          {/* Vertical divider */}
          <div className="cs-divider" style={{ width: 1, alignSelf: "stretch", margin: "80px 32px", background: `linear-gradient(to bottom, transparent, ${color}30, ${colorBright}20, ${color}30, transparent)` }} />

          {/* ─── RIGHT: Glossy Form Card ─── */}
          <div className="cs-right cs-card-shine-wrap" style={{ flex: "0 0 380px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GlossyCard color={color} colorBright={colorBright} formCardRef={formCardRef}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 22, position: "relative" }}>
                <div className="flex items-center justify-center gap-3" style={{ marginBottom: 10 }}>
                  <span style={{ width: 24, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color }}>Stay Updated</span>
                  <span style={{ width: 24, height: 1, background: `linear-gradient(270deg, transparent, ${color})` }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "white", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Register Your Interest</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.5, margin: 0 }}>Be first to know when registration opens.</p>
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 0 40px ${color}25` }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={colorBright} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", marginBottom: 6 }}>You&apos;re on the list!</h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>We&apos;ll notify you when registration opens.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input type="text" name="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} style={{ position: "absolute", left: -9999, opacity: 0 }} tabIndex={-1} autoComplete="off" />

                  {/* Staggered field entrances */}
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.boxShadow = `0 0 20px ${color}15`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                  </motion.div>

                  <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                    <input type="email" placeholder="Work Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.boxShadow = `0 0 20px ${color}15`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                  </motion.div>

                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                    <input type="text" placeholder="Company *" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.boxShadow = `0 0 20px ${color}15`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                  </motion.div>

                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" style={{ display: "flex", gap: 8 }}>
                    <select className="cs-select" value={selectedCountry.code} onChange={(e) => { const c = COUNTRY_CODES.find((cc) => cc.code === e.target.value); if (c) setSelectedCountry(c); }} style={{ ...inputStyle, width: 100, flexShrink: 0, cursor: "pointer" }}>
                      {COUNTRY_CODES.map((c, i) => <option key={`${c.code}-${i}`} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <input type="tel" placeholder="Phone *" value={formData.phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, phone: v }); }} maxLength={selectedCountry.length} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.boxShadow = `0 0 20px ${color}15`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                  </motion.div>

                  {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

                  <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                    <button type="submit" disabled={submitting} className="cs-cta-btn" style={{
                      width: "100%", marginTop: 4, padding: "13px 28px", borderRadius: 50, border: "none",
                      background: `linear-gradient(135deg, ${color}, ${colorBright})`,
                      color: "white", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700,
                      cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1,
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: `0 4px 24px ${color}35`,
                    }} onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 16px 50px ${color}50`; } }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px ${color}35`; }}>
                      {submitting ? "Submitting..." : "Register Interest →"}
                    </button>
                  </motion.div>
                </form>
              )}
            </GlossyCard>
          </div>
        </div>{/* close cs-content-wrap */}

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 20 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${color}25, transparent)` }} />
          <div style={{ padding: "14px 0", background: "rgba(5,5,5,0.8)", backdropFilter: "blur(10px)" }}>
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 4vw, 60px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: colorBright, boxShadow: `0 0 8px ${colorBright}` }} />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{seriesName}</span>
              </div>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Events First Group</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
