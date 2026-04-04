"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import SeriesTickerBar from "@/components/ui/SeriesTickerBar";

// OT Security First brand colors
const OT_CRIMSON = "#D34B9A";
const OT_FIREBRICK = "#E86BB8";

// Sector badges
const sectors = [
  { label: "ENERGY", active: true, comingSoon: false },
  { label: "OIL & GAS", active: true, comingSoon: false },
  { label: "UTILITIES", active: true, comingSoon: false },
  { label: "MANUFACTURING", active: false, comingSoon: true },
];

// Stats for the hero
const stats = [
  { value: 1, suffix: "", label: "EDITION" },
  { value: 4, suffix: "", label: "CITIES" },
  { value: 30, suffix: "+", label: "SPEAKERS" },
  { value: 15, suffix: "+", label: "VENDORS" },
];

export default function OTSeriesHero() {
  const heroRef = useRef<HTMLElement>(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "var(--black)",
      }}
    >
      {/* Industrial Background Image - Power Grid / Refinery */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.15) saturate(0.6)",
          }}
        />
      </div>

      {/* Gradient overlays per spec */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(211,75,154,0.04) 40%, rgba(10,10,10,0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 80%, rgba(211,75,154,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Industrial noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content - Centered per spec */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{
          minHeight: "100vh",
          maxWidth: 900,
          margin: "0 auto",
          padding: "12vh clamp(20px, 4vw, 60px) 80px",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3">
            <span
              style={{
                width: 40,
                height: 1,
                background: OT_CRIMSON,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: OT_CRIMSON,
              }}
            >
              OT Security First Series
            </span>
            <span
              style={{
                width: 40,
                height: 1,
                background: OT_CRIMSON,
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(48px, 7vw, 88px)",
            letterSpacing: "-3px",
            lineHeight: 1.05,
            color: "var(--white)",
            margin: "16px 0 0",
          }}
        >
          OT Security First
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(16px, 2vw, 22px)",
            fontWeight: 300,
            color: `${OT_CRIMSON}B3`,
            marginTop: 6,
          }}
        >
          Protecting What Runs the World
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.7,
            color: "#909090",
            marginTop: 20,
            maxWidth: 560,
          }}
        >
          The MENA region's only dedicated summit for operational technology
          security in energy and utilities. Where the people protecting power
          grids, oil refineries, water systems, and industrial infrastructure
          come together.
        </motion.p>

        {/* Sector badges - Angular (4px radius) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-2"
          style={{ marginTop: 24 }}
        >
          {sectors.map((sector) => (
            <span
              key={sector.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: sector.active ? OT_CRIMSON : "transparent",
                border: sector.active
                  ? "none"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 4,
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "2px",
                color: sector.active ? "var(--white)" : "#404040",
              }}
            >
              {sector.label}
              {sector.comingSoon && (
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 500,
                    letterSpacing: "1px",
                    color: "#555",
                    textTransform: "uppercase",
                  }}
                >
                  Soon
                </span>
              )}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons - Angular (6px radius, NOT pill) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-3"
          style={{ marginTop: 28 }}
        >
          <CTAButton primary href="#register">
            Register for Next Edition →
          </CTAButton>
          <CTAButton href="#register">Become a Sponsor →</CTAButton>
        </motion.div>

        {/* Stats Row - Floating in content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="stats-row flex flex-wrap items-center justify-center"
          style={{
            marginTop: 32,
            gap: 40,
          }}
        >
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} delay={0.65 + index * 0.08} />
          ))}
        </motion.div>
      </div>

      {/* Ticker Bar - Absolute bottom */}
      <SeriesTickerBar
        accentColor={OT_CRIMSON}
        announcingText="Announcing Soon"
        location="Expanding worldwide"
        ctaText="Get Notified"
        ctaHref="#register"
        angularRadius={true}
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
 * CTAButton, Angular industrial-style button (6px radius, NOT pill)
 */
function CTAButton({
  children,
  primary = false,
  href,
  external = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
  href: string;
  external?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const sharedProps = {
    className: "inline-flex items-center gap-2 transition-all",
    style: {
      padding: "12px 24px",
      borderRadius: 6,
      background: primary
        ? isHovered
          ? OT_FIREBRICK
          : OT_CRIMSON
        : isHovered
          ? `${OT_CRIMSON}14`
          : "transparent",
      border: primary ? "none" : `1px solid ${OT_CRIMSON}`,
      fontFamily: "var(--font-outfit)",
      fontSize: 14,
      fontWeight: 500,
      color: primary ? "var(--white)" : OT_CRIMSON,
      transitionDuration: "0.4s",
      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...sharedProps}>
      {children}
    </Link>
  );
}

/**
 * StatItem, Animated counting stat
 */
function StatItem({
  stat,
  delay,
}: {
  stat: (typeof stats)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1800;
    const steps = 50;
    const increment = stat.value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 800,
          color: "var(--white)",
          margin: 0,
        }}
      >
        {count}
        <span style={{ color: OT_CRIMSON }}>{stat.suffix}</span>
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#686868",
          marginTop: 4,
        }}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}
