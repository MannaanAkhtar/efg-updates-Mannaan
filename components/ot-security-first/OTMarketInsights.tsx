"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";

// 6 stats from the spec
const marketStats = [
  {
    id: 1,
    value: "$8.75M",
    isNumber: false,
    label: "Average cost of a data breach in the Middle East",
    source: "IBM Cost of a Data Breach 2025",
  },
  {
    id: 2,
    value: 200,
    suffix: "K+",
    isNumber: true,
    label: "Daily cyberattack attempts targeting the UAE",
    source: "UAE Cybersecurity Council",
  },
  {
    id: 3,
    value: 70,
    suffix: "%",
    isNumber: true,
    label: "Of OT environments have at least one unpatched critical vulnerability",
    source: "Claroty State of XIoT Security",
  },
  {
    id: 4,
    value: 40,
    suffix: "%",
    isNumber: true,
    label: "Of industrial organizations experienced an OT security incident in the past year",
    source: "Fortinet OT Security Report",
  },
  {
    id: 5,
    value: "$3.5B+",
    isNumber: false,
    label: "Projected UAE cybersecurity market by 2026",
    source: "MarketsandMarkets",
  },
  {
    id: 6,
    value: "#1",
    isNumber: false,
    label: "UAE ranked in the 2024 Global Cybersecurity Index",
    source: "ITU Global Cybersecurity Index",
  },
];

export default function OTMarketInsights() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#111111",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scan-line texture, industrial monitor feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,75,154,0.04) 3px, rgba(211,75,154,0.04) 4px)",
        }}
      />
      {/* Radial crimson glow, bottom-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 85% 70%, ${OT_CRIMSON}15 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative" as const,
          zIndex: 1,
        }}
      >
        <div
          className="insights-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
          }}
        >
          {/* LEFT - Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <div className="flex items-center gap-3">
              <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: OT_CRIMSON,
                }}
              >
                The Threat Landscape
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(30px, 3.5vw, 44px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: "20px 0 0",
              }}
            >
              When OT Fails, the Physical World Breaks
            </h2>

            {/* Paragraph */}
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "#808080",
                marginTop: 24,
              }}
            >
              Unlike IT security breaches, attacks on operational technology
              don't just steal data, they can halt production, damage physical
              equipment, and endanger lives. A compromised pipeline, a
              manipulated power grid, or a hacked water treatment facility has
              consequences that extend far beyond the digital realm. The threat
              actors targeting critical infrastructure know this, and they're
              getting more sophisticated every day.
            </p>

            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "#707070",
                marginTop: 16,
              }}
            >
              The numbers paint a stark picture of why OT security can no longer
              be an afterthought.
            </p>
          </motion.div>

          {/* RIGHT - Stats grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="stats-2col-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {marketStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <StatBlock stat={stat} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: OT_CRIMSON,
              textDecoration: "none",
              letterSpacing: "0.5px",
            }}
          >
            Discuss Your OT Security Posture →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .insights-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 500px) {
          .stats-2col-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * StatBlock, Individual stat with left border (angular)
 */
function StatBlock({ stat }: { stat: (typeof marketStats)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || !stat.isNumber) return;

    const value = stat.value as number;
    const duration = 1600;
    const steps = 40;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, stat.isNumber, stat.value]);

  return (
    <div
      ref={ref}
      style={{
        borderLeft: `3px solid ${OT_CRIMSON}30`,
        padding: 22,
        background: `${OT_CRIMSON}08`,
        borderRadius: 6,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 800,
          color: OT_CRIMSON,
          margin: 0,
          lineHeight: 1,
        }}
      >
        {stat.isNumber ? (
          <>
            {count}
            {stat.suffix}
          </>
        ) : (
          stat.value
        )}
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 400,
          color: "#808080",
          marginTop: 10,
          lineHeight: 1.5,
        }}
      >
        {stat.label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 400,
          color: "#505050",
          marginTop: 4,
          lineHeight: 1.3,
          fontStyle: "italic",
        }}
      >
        {stat.source}
      </p>
    </div>
  );
}
