"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SeriesTickerBar from "@/components/ui/SeriesTickerBar";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, EFFECTS, GRADIENTS, PREMIUM_IMAGES } from "@/lib/cyber-design-tokens";

// Edition data
const editions = [
  { id: "uae", label: "UAE", status: "completed" },
  { id: "kuwait", label: "KUWAIT", status: "upcoming" },
  { id: "ksa", label: "KSA", status: "coming-soon" },
  { id: "qatar", label: "QATAR", status: "coming-soon" },
];

// Stats data
const stats = [
  { value: 1500, suffix: "+", label: "SECURITY LEADERS" },
  { value: 92, suffix: "%", label: "DIRECTOR-LEVEL+" },
  { value: 80, suffix: "+", label: "SPEAKERS" },
  { value: 50, suffix: "+", label: "SPONSORS" },
];

// Easing function: easeOutExpo
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export default function SeriesHero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: COLORS.bgDeep,
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PREMIUM_IMAGES.heroNetworkDark}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.12) saturate(0.7)",
          }}
        />
      </div>

      {/* Blue atmosphere gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: GRADIENTS.heroOverlay }}
      />

      {/* Radial blue glow from bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: GRADIENTS.sectionGlow }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: EFFECTS.filmGrain,
          backgroundRepeat: "repeat",
          opacity: EFFECTS.filmGrainOpacity,
        }}
      />

      {/* Cyber grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${COLORS.cyan}04 1px, transparent 1px), linear-gradient(90deg, ${COLORS.cyan}04 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{
          minHeight: "100vh",
          paddingTop: "12vh",
          paddingBottom: 80,
        }}
      >
        <div style={{ maxWidth: 900 }}>
          {/* Series Identity Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: ANIMATION.ease }}
            className="flex items-center justify-center gap-3"
          >
            <span
              style={{
                width: 40,
                height: 2,
                background: COLORS.cyan,
                display: "inline-block",
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              Cyber First Series
            </span>
            <span
              style={{
                width: 40,
                height: 2,
                background: COLORS.cyan,
                display: "inline-block",
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: ANIMATION.ease }}
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              ...TYPOGRAPHY.heroTitle,
              color: COLORS.textPrimary,
              marginTop: 16,
            }}
          >
            Cyber First
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: ANIMATION.ease }}
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              fontWeight: 400,
              fontSize: "clamp(16px, 2vw, 22px)",
              color: COLORS.cyanBright,
              letterSpacing: "1px",
              marginTop: 6,
            }}
          >
            Where the GCC&rsquo;s Top CISOs Convene
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: ANIMATION.ease }}
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textSecondary,
              maxWidth: 560,
              margin: "20px auto 0",
            }}
          >
            1,500+ security leaders across Abu Dhabi, Kuwait, Riyadh, and Doha.
            92% director-level and above. The room where GCC cybersecurity
            strategy is shaped.
          </motion.p>

          {/* Edition Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: ANIMATION.ease }}
            className="flex flex-wrap items-center justify-center gap-2.5"
            style={{ marginTop: 24 }}
          >
            {editions.map((edition) => (
              <EditionBadge key={edition.id} edition={edition} />
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: ANIMATION.ease }}
            className="flex flex-wrap items-center justify-center gap-4"
            style={{ marginTop: 28 }}
          >
            <Link
              href="#register"
              className="inline-flex items-center gap-2 transition-all duration-300"
              style={{
                padding: "14px 32px",
                borderRadius: RADIUS.round,
                background: COLORS.cyan,
                color: COLORS.bgDeep,
                fontFamily: TYPOGRAPHY.fontBody,
                fontSize: 15,
                fontWeight: 600,
                boxShadow: SHADOWS.cyanGlow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.cyanBright;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = SHADOWS.cyanGlowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.cyan;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = SHADOWS.cyanGlow;
              }}
            >
              <span>Register for Kuwait 2026</span>
              <span>→</span>
            </Link>
            <Link
              href="/sponsors-and-partners"
              className="inline-flex items-center gap-2 transition-all duration-300"
              style={{
                padding: "14px 28px",
                borderRadius: RADIUS.round,
                background: "transparent",
                border: `1px solid ${COLORS.borderAccent}`,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
                fontSize: 14,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.cyanSubtle;
                e.currentTarget.style.borderColor = COLORS.cyan;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = COLORS.borderAccent;
              }}
            >
              <span>Become a Sponsor</span>
              <span>→</span>
            </Link>
          </motion.div>

          {/* Stats Row - Floating in content area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: ANIMATION.ease }}
            className="stats-row flex flex-wrap items-center justify-center"
            style={{
              marginTop: 32,
              gap: 40,
            }}
          >
            {stats.map((stat, index) => (
              <StatItem key={stat.label} stat={stat} delay={index * 100} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Ticker Bar - Absolute bottom */}
      <SeriesTickerBar
        accentColor={COLORS.cyan}
        eventName="Cyber First Kuwait"
        location="Kuwait City, Kuwait"
        targetDate={new Date("2026-04-21T09:00:00")}
        ctaText="Register"
        ctaHref="#register"
        angularRadius={false}
      />

      <style jsx global>{`
        @media (max-width: 768px) {
          .stats-row {
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * EditionBadge — Shows edition status
 */
function EditionBadge({
  edition,
}: {
  edition: { id: string; label: string; status: string };
}) {
  const isCompleted = edition.status === "completed";
  const isUpcoming = edition.status === "upcoming";

  return (
    <div
      className={`transition-all duration-300 ${isUpcoming ? "animate-pulse-glow" : ""}`}
      style={{
        padding: "6px 16px",
        borderRadius: RADIUS.round,
        background: isCompleted ? COLORS.cyanSubtle : "transparent",
        border: isCompleted
          ? `1px solid ${COLORS.borderAccent}`
          : isUpcoming
            ? `1px solid ${COLORS.borderAccentHover}`
            : `1px solid ${COLORS.borderSubtle}`,
        color: isCompleted || isUpcoming ? COLORS.cyan : COLORS.textMuted,
        boxShadow: isUpcoming ? SHADOWS.cyanGlow : "none",
        fontFamily: TYPOGRAPHY.fontBody,
        ...TYPOGRAPHY.sectionLabel,
      }}
    >
      {edition.label}
    </div>
  );
}

/**
 * StatItem — Counting stat with easeOutExpo
 */
function StatItem({
  stat,
  delay,
}: {
  stat: { value: number; suffix: string; label: string };
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [showSuffix, setShowSuffix] = useState(false);

  useEffect(() => {
    const startTime = Date.now() + delay + 900; // After hero animation
    const duration = 1800;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.floor(easedProgress * stat.value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(stat.value);
        if (stat.suffix) {
          setTimeout(() => setShowSuffix(true), 50);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [stat.value, stat.suffix, delay]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          fontWeight: 800,
          fontSize: 26,
          color: COLORS.textPrimary,
          lineHeight: 1,
        }}
      >
        {displayValue.toLocaleString()}
        {stat.suffix && (
          <span
            style={{
              color: COLORS.cyan,
              display: "inline-block",
              transform: showSuffix ? "scale(1)" : "scale(1.3)",
              opacity: showSuffix ? 1 : 0,
              transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
            }}
          >
            {stat.suffix}
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontBody,
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: COLORS.textMuted,
          marginTop: 4,
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}
