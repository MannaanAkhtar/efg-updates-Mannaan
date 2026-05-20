"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  const [resourceMenuOpen, setResourceMenuOpen] = useState(false);
  const resourceMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resourceMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (resourceMenuRef.current && !resourceMenuRef.current.contains(e.target as Node)) {
        setResourceMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResourceMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [resourceMenuOpen]);

  const openRequest = (type: "Past Event Report" | "Delegate List") => {
    setResourceMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent("opex-series:open-request", { detail: { type } }),
    );
  };

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

          {/* Third CTA — Request Resources dropdown (opens modal form) */}
          <div ref={resourceMenuRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              type="button"
              onClick={() => setResourceMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={resourceMenuOpen}
              className="opex-hero-resources"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 50,
                background: "transparent",
                border: `1px solid ${VIOLET}`,
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 500,
                color: VIOLET,
                cursor: "pointer",
                transitionDuration: "0.3s",
              }}
            >
              <span>Request Resources</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: resourceMenuOpen ? "rotate(0)" : "rotate(180deg)",
                  transition: "transform 0.25s ease",
                  opacity: 0.85,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {resourceMenuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: 0,
                    minWidth: 320,
                    padding: 6,
                    borderRadius: 18,
                    background: "rgba(14, 10, 28, 0.94)",
                    border: `1px solid ${VIOLET}55`,
                    backdropFilter: "blur(18px) saturate(180%)",
                    WebkitBackdropFilter: "blur(18px) saturate(180%)",
                    boxShadow:
                      "0 22px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
                    zIndex: 30,
                    textAlign: "left",
                  }}
                >
                  {/* Past Event Report */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openRequest("Past Event Report")}
                    className="opex-hero-menu-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `${VIOLET}33`,
                      border: `1px solid ${VIOLET_BRIGHT}55`,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={VIOLET_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9 15 12 18 15 15" />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                        Past Event Report
                      </span>
                      <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                        Request the PDF report from a past edition
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 10px" }} />

                  {/* Delegate List */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openRequest("Delegate List")}
                    className="opex-hero-menu-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `${VIOLET}33`,
                      border: `1px solid ${VIOLET_BRIGHT}55`,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={VIOLET_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                        Delegate List
                      </span>
                      <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                        Request the confirmed attendee roster
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <style jsx global>{`
                    .opex-hero-menu-item:hover { background: ${VIOLET}26 !important; }
                    .opex-hero-menu-item:focus-visible { outline: none; background: ${VIOLET}3a !important; }
                    .opex-hero-resources:hover { background: ${VIOLET}15 !important; }
                  `}</style>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
