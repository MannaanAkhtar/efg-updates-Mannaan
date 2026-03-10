"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import SeriesTickerBar from "@/components/ui/SeriesTickerBar";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const EASE = [0.16, 1, 0.3, 1] as const;

const heroStats = [
  { value: 2, suffix: "", label: "EDITIONS COMPLETED" },
  { value: 4, suffix: "", label: "CITIES PLANNED" },
  { value: 300, suffix: "+", label: "DELEGATES TO DATE" },
  { value: 30, suffix: "+", label: "SPEAKERS FEATURED" },
];

const focusBadges = ["PROCESS EXCELLENCE", "DIGITAL TRANSFORMATION", "SUSTAINABILITY"];

export default function OpexHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#0A0A0A" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://opexfirst.com/wp-content/uploads/2025/10/DSC08180.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.15) saturate(0.4)" }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(124,58,237,0.04) 40%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      {/* Radial violet glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 80%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ minHeight: "100vh", padding: "0 24px 56px" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center"
          style={{ marginTop: "18vh" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ width: 40, height: 1, background: VIOLET }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: VIOLET,
              }}
            >
              Opex First Series
            </span>
            <span style={{ width: 40, height: 1, background: VIOLET }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              color: "#404040",
              marginTop: 8,
            }}
          >
            AN EVENTS FIRST GROUP SERIES
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(56px, 8vw, 100px)",
            letterSpacing: "-2px",
            lineHeight: 1,
            color: "var(--white)",
            marginTop: 20,
          }}
        >
          Opex First
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            fontWeight: 300,
            color: `${VIOLET}B3`,
            marginTop: 12,
          }}
        >
          Where Efficiency Meets Excellence
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 17,
            fontWeight: 300,
            color: "#909090",
            lineHeight: 1.7,
            maxWidth: 600,
            marginTop: 24,
          }}
        >
          The dedicated summit series for operational excellence, business
          transformation, and process innovation. Bringing together COOs,
          excellence leaders, and transformation architects worldwide.
        </motion.p>

        {/* Focus Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="flex flex-wrap justify-center gap-2"
          style={{ marginTop: 24 }}
        >
          {focusBadges.map((badge) => (
            <span
              key={badge}
              style={{
                padding: "8px 16px",
                borderRadius: 50,
                background: VIOLET,
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "1.5px",
                color: "var(--white)",
              }}
            >
              {badge}
            </span>
          ))}
          <span
            style={{
              padding: "8px 16px",
              borderRadius: 50,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "1.5px",
              color: "#404040",
            }}
          >
            SUPPLY CHAIN
          </span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
          className="flex flex-wrap justify-center gap-3"
          style={{ marginTop: 28 }}
        >
          <HeroButton primary href="#editions">
            View Upcoming Edition →
          </HeroButton>
          <HeroButton href="/sponsors-and-partners">Become a Sponsor →</HeroButton>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
          className="flex flex-wrap justify-center gap-8"
          style={{ marginTop: 40 }}
        >
          {heroStats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>

      {/* Ticker Bar */}
      <SeriesTickerBar
        accentColor={VIOLET}
        eventName="Opex First Abu Dhabi"
        location="St. Regis, Abu Dhabi"
        targetDate={new Date("2026-02-10T09:00:00")}
        ctaText="View Highlights"
        ctaHref="/events/opex-first"
        angularRadius={false}
      />
    </section>
  );
}

function HeroButton({
  children,
  primary = false,
  href,
}: {
  children: React.ReactNode;
  primary?: boolean;
  href: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-all"
      style={{
        padding: "14px 28px",
        borderRadius: 50,
        background: primary
          ? isHovered
            ? VIOLET_BRIGHT
            : VIOLET
          : isHovered
            ? `${VIOLET}15`
            : "transparent",
        border: primary ? "none" : `1px solid ${VIOLET}`,
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: primary ? "var(--white)" : VIOLET,
        transitionDuration: "0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  const animate = useCallback(() => {
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => {
    if (isInView) animate();
  }, [isInView, animate]);

  return (
    <div ref={ref} className="text-center">
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 800,
          color: "var(--white)",
          margin: 0,
        }}
      >
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "2px",
          color: "#505050",
          marginTop: 4,
        }}
      >
        {label}
      </p>
    </div>
  );
}
