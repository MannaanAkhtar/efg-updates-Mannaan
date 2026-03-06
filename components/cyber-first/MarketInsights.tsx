"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SPACING } from "@/lib/cyber-design-tokens";

// Market stats data
const marketStats = [
  {
    id: 1,
    value: 8.75,
    prefix: "$",
    suffix: "M",
    label: "Average cost of a data breach in the Middle East — among the highest globally",
  },
  {
    id: 2,
    value: 200,
    prefix: "",
    suffix: "K+",
    label: "Cyberattack attempts targeting the UAE every single day",
  },
  {
    id: 3,
    value: 40,
    prefix: "",
    suffix: "%",
    label: "Year-on-year increase in cyber incidents across the GCC region",
  },
  {
    id: 4,
    value: 92,
    prefix: "",
    suffix: "%",
    label: "Of organizations in the region increasing their cybersecurity budgets",
  },
  {
    id: 5,
    value: 3.5,
    prefix: "$",
    suffix: "B+",
    label: "Projected UAE cybersecurity market value by 2026",
  },
];

// Easing function
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export default function MarketInsights() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgBase,
        padding: `${SPACING.sectionPadding} 0`,
      }}
    >
      <div
        className="market-insights-container"
        style={{
          maxWidth: SPACING.maxWidth,
          margin: "0 auto",
          padding: `0 ${SPACING.containerPadding}`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* Left Column — Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: ANIMATION.ease }}
        >
          {/* Label */}
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              Market Insights
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "-1px",
              color: COLORS.textPrimary,
              lineHeight: 1.15,
              margin: "16px 0 0",
            }}
          >
            The Threat Is Accelerating. Your Peers Are Already Here.
          </h2>

          {/* Paragraph */}
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textSecondary,
              margin: "16px 0 0",
            }}
          >
            The GCC is investing billions in digital transformation — and
            adversaries know it. The attack surface is expanding faster than
            most organisations can defend. These aren&rsquo;t statistics to
            worry about in isolation. They&rsquo;re the reason 1,500+
            security leaders refuse to miss Cyber First.
          </p>
        </motion.div>

        {/* Right Column — Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: SPACING.gridGapDefault,
          }}
        >
          {marketStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
                ease: ANIMATION.ease,
              }}
            >
              <StatBlock stat={stat} isInView={isInView} delay={index * 100} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .market-insights-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .market-insights-container > div:first-child {
            order: 2;
          }
          .market-insights-container > div:last-child {
            order: 1;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * StatBlock — Individual stat with counting animation
 */
function StatBlock({
  stat,
  isInView,
  delay,
}: {
  stat: (typeof marketStats)[0];
  isInView: boolean;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now() + delay + 300;
    const duration = 1500;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      // Handle decimal values
      if (stat.value % 1 !== 0) {
        setDisplayValue(
          Math.round(easedProgress * stat.value * 100) / 100
        );
      } else {
        setDisplayValue(Math.floor(easedProgress * stat.value));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(stat.value);
        setAnimationComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, stat.value, delay]);

  const formatValue = (val: number) => {
    if (stat.value % 1 !== 0) {
      return val.toFixed(2);
    }
    return val.toLocaleString();
  };

  return (
    <div
      className="transition-all duration-300"
      style={{
        background: isHovered ? COLORS.cyanSubtle : "rgba(1, 187, 245, 0.02)",
        border: isHovered
          ? `1px solid ${COLORS.borderAccentHover}`
          : `1px solid ${COLORS.borderAccent}`,
        borderRadius: RADIUS.md,
        padding: 24,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          fontSize: "clamp(28px, 3vw, 38px)",
          fontWeight: 800,
          color: COLORS.cyan,
          letterSpacing: "-1px",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            opacity: animationComplete ? 1 : 0.7,
            transition: "opacity 0.3s",
          }}
        >
          {stat.prefix}
        </span>
        {formatValue(displayValue)}
        <span
          style={{
            opacity: animationComplete ? 1 : 0.7,
            transition: "opacity 0.3s",
          }}
        >
          {stat.suffix}
        </span>
      </div>
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontBody,
          fontSize: 12.5,
          fontWeight: 400,
          color: COLORS.textTertiary,
          lineHeight: 1.5,
          marginTop: 6,
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}
