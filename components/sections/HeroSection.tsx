"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const CFK = `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos`;
const HOME = `${S3}/home-event-spec`;

interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string[];   // lines of the headline
  accent: string;    // last word gets the orange shimmer
  sub: string;
}

const heroSlides: HeroSlide[] = [
  {
    // Grand ballroom panoramic — packed full house, ornate wooden architecture. SCALE.
    image: `${CFK}/cyber21-04-160.jpg`,
    eyebrow: "Cyber First Kuwait · 21 April 2026 · Kuwait City",
    title: ["Where the Region's", "Decisions Are"],
    accent: "Made.",
    sub: "500+ CISOs, CDOs and Government Officials. One room. One day. Kuwait City.",
  },
  {
    // Wide panel on stage with full audience — branded LED backdrop. AUTHORITY.
    image: `${CFK}/cyber21-04-324.jpg`,
    eyebrow: "200+ Speakers · 12 Cities · 6 Nations",
    title: ["Conversations That"],
    accent: "Move Industries.",
    sub: "Honest dialogue on what comes next — and who needs to be in the room when it arrives.",
  },
  {
    // VIP front row — uniformed officials, gilded hall. CREDIBILITY.
    image: `${CFK}/cyber21-04-245.jpg`,
    eyebrow: "Ministerial & Regulatory Participation · Global",
    title: ["Government and Industry.", "On The Same"],
    accent: "Stage.",
    sub: "The only summit series with active ministerial and regulatory voices in every session.",
  },
  {
    // Exhibition floor packed — chandeliers, dense crowd, vibrant booths. ENERGY.
    image: `${CFK}/cyber21-04-410.jpg`,
    eyebrow: "5,000+ Delegates · 16 Editions · 99+ Sponsors",
    title: ["The World's Most", "Trusted Technology"],
    accent: "Summit Series.",
    sub: "From Kuwait to Nairobi. From the CISO to the Minister. Every edition, every city.",
  },
  {
    // Aerial panorama of the full expo floor — signature shot. PRESTIGE.
    image: `${CFK}/cyber21-04-500.jpg`,
    eyebrow: "Cyber First · OT Security · Data & AI · Opex First",
    title: ["Four Series.", "Multiple Cities."],
    accent: "One Standard.",
    sub: "Built for enterprise leaders shaping the digital and security future.",
  },
];

// Next event data for the countdown
const nextEvent = {
  name: "Cyber First Kuwait",
  location: "Kuwait City, Kuwait",
  date: new Date("2026-04-21T09:00:00"),
};

// Slideshow timing
const SLIDE_DURATION = 5500; // 5.5 seconds — enough to read the headline
const CROSSFADE_DURATION = 1.2; // 1.2 second crossfade

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const imageSources = heroSlides.map((s) => s.image);
  const activeSlide = heroSlides[activeIndex];

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (imageSources.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imageSources.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [imageSources.length]);

  return (
    <section
      ref={heroRef}
      className="hero-no-pad-override relative w-full overflow-hidden"
      style={{
        height: "100vh",
        background: "transparent",
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          LAYER 1: BACKGROUND IMAGE SLIDESHOW
          Like memories fading into one another
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
          willChange: "transform",
        }}
      >
        <AnimatePresence mode="sync">
          {imageSources.map((src, index) => (
            index === activeIndex && (
              <motion.div
                key={`${src}-${index}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: CROSSFADE_DURATION,
                  ease: "easeInOut",
                }}
              >
                <HeroImage src={src} isActive={index === activeIndex} />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          LAYER 2: GRADIENT OVERLAY
          Dark top for nav, hint of image in middle, dark bottom for transition
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(10, 10, 10, 0.85) 0%,
              rgba(10, 10, 10, 0.6) 45%,
              rgba(10, 10, 10, 0.25) 75%,
              rgba(10, 10, 10, 0.15) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(10, 10, 10, 0.5) 0%,
              rgba(10, 10, 10, 0.1) 35%,
              rgba(10, 10, 10, 0.15) 65%,
              rgba(10, 10, 10, 0.95) 100%
            )
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          LAYER 3: VIGNETTE
          Radial darkening pulling the eye inward
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none z-2"
        style={{
          background: `radial-gradient(
            ellipse 70% 60% at 50% 45%,
            transparent 0%,
            rgba(10, 10, 10, 0.55) 100%
          )`,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          LAYER 4: FILM GRAIN — SUBTLE CINEMA TEXTURE
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          LAYER 5: HERO CONTENT — VERTICALLY CENTERED
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex items-center px-6 hero-content-wrapper"
        style={{
          height: "100%",
          paddingTop: 160,
          paddingBottom: 100,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", width: "100%" }}>
          {/* Dynamic per-slide headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{ marginBottom: 40 }}
            >
              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(10px, 0.85vw, 12px)",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  marginBottom: 20,
                }}
              >
                {activeSlide.eyebrow}
              </p>

              {/* Headline with orange vertical bar */}
              <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <div
                  style={{
                    width: 4,
                    background: "linear-gradient(to bottom, var(--orange), var(--orange-bright))",
                    borderRadius: 2,
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                />
                <h1
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(40px, 6.5vw, 82px)",
                    lineHeight: 1.05,
                    letterSpacing: "-2px",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {activeSlide.title.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                  <span
                    className="block"
                    style={{
                      background: "linear-gradient(90deg, #FFFFFF 0%, #E8651A 30%, #FF7A2E 60%, #FFFFFF 100%)",
                      backgroundSize: "300% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      animation: "shimmer 5s ease-in-out infinite alternate",
                    }}
                  >
                    {activeSlide.accent}
                  </span>
                </h1>
              </div>

              {/* Sub */}
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: "clamp(14px, 1.3vw, 17px)",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                {activeSlide.sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            {/* Primary Button */}
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 transition-all duration-300"
              style={{
                padding: "16px 36px",
                borderRadius: 60,
                background: "var(--orange)",
                color: "white",
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--orange-bright)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px var(--orange-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--orange)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>Explore Events</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ fontSize: 16 }}
              >
                →
              </span>
            </Link>

            {/* Ghost Button */}
            <Link
              href="/sponsors-and-partners"
              className="transition-all duration-300"
              style={{
                padding: "16px 36px",
                borderRadius: 60,
                background: "transparent",
                color: "var(--white)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              Become a Partner
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SLIDESHOW INDICATORS — Subtle dots showing current image
          ═══════════════════════════════════════════════════════════════ */}
      {imageSources.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute flex flex-col items-center gap-2 z-10"
          style={{ bottom: 100, right: 16 }}
        >
          {imageSources.map((_, index) => (
            <div
              key={index}
              className="transition-all duration-400"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: index === activeIndex ? "#E8651A" : "rgba(255, 255, 255, 0.2)",
                boxShadow: index === activeIndex ? "0 0 8px rgba(232, 101, 26, 0.5)" : "none",
              }}
            />
          ))}
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          COUNTDOWN TICKER — Fixed at viewport bottom
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.5 }}
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          background: "rgba(10, 10, 10, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "12px 0",
        }}
      >
        {/* ── DESKTOP ticker ── */}
        <div
          className="hidden sm:flex items-center justify-between"
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 60px)",
          }}
        >
          {/* Left side: Event info */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: "var(--orange)", animationDuration: "2s" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--orange)" }}
              />
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--white-muted)", fontFamily: "var(--font-outfit)" }}>
              Next Up
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--white)", fontFamily: "var(--font-display)" }}>
              {nextEvent.name}
            </span>
            <span style={{ fontSize: 13, color: "var(--white-dim)", fontFamily: "var(--font-outfit)" }}>
              · {nextEvent.location}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <CountdownDisplay date={nextEvent.date} />
            <Link
              href="/events/cyber-first/kuwait-2026"
              className="transition-colors duration-300 flex items-center gap-1"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--orange)", fontFamily: "var(--font-outfit)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--orange-bright)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--orange)"; }}
            >
              Register <span>→</span>
            </Link>
          </div>
        </div>

        {/* ── MOBILE ticker — compact two-row layout ── */}
        <div
          className="flex sm:hidden items-center justify-between"
          style={{ padding: "0 20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span className="relative flex h-2 w-2" style={{ flexShrink: 0 }}>
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "var(--orange)", animationDuration: "2s" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--orange)" }} />
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {nextEvent.name}
              </p>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                {nextEvent.location}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <CountdownDisplay date={nextEvent.date} compact />
            <Link
              href="/events/cyber-first/kuwait-2026"
              style={{ fontSize: 12, fontWeight: 600, color: "var(--orange)", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}
            >
              Register →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Shimmer animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (max-width: 640px) {
          .hero-content-wrapper {
            padding-top: 100px !important;
            padding-bottom: 120px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * HeroImage — Individual slideshow image with Ken Burns effect
 */
function HeroImage({
  src,
  isActive,
}: {
  src: string;
  isActive: boolean;
}) {
  // Ken Burns: scale from 1.0 to 1.05 over slide duration while active
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        transform: isActive ? "scale(1.05)" : "scale(1)",
        transition: `transform ${SLIDE_DURATION}ms ease-out`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-full h-[120%] object-cover"
        style={{
          filter: "brightness(0.6)",
          transition: "filter 0.5s ease",
        }}
      />
    </div>
  );
}

/**
 * CountdownDisplay — The live countdown numbers
 */
function CountdownDisplay({ date, compact = false }: { date: Date; compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = date.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="flex items-center gap-1">
      <CountdownUnit value={timeLeft.days} label="D" compact={compact} />
      <span style={{ color: "rgba(232, 101, 26, 0.4)", fontSize: compact ? 12 : 18 }}>:</span>
      <CountdownUnit value={timeLeft.hours} label="H" compact={compact} />
      <span style={{ color: "rgba(232, 101, 26, 0.4)", fontSize: compact ? 12 : 18 }}>:</span>
      <CountdownUnit value={timeLeft.minutes} label="M" compact={compact} />
      <span style={{ color: "rgba(232, 101, 26, 0.4)", fontSize: compact ? 12 : 18 }}>:</span>
      <CountdownUnit value={timeLeft.seconds} label="S" compact={compact} />
    </div>
  );
}

/**
 * CountdownUnit — Individual countdown number display
 */
function CountdownUnit({ value, label, compact = false }: { value: number; label: string; compact?: boolean }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span
        className="tabular-nums"
        style={{
          fontSize: compact ? 15 : 24,
          fontWeight: 700,
          color: "var(--white)",
          fontFamily: "var(--font-display)",
          minWidth: compact ? 18 : 32,
          textAlign: "center",
        }}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span
        style={{
          fontSize: compact ? 8 : 11,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          fontFamily: "var(--font-outfit)",
          fontWeight: 600,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
