"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS } from "@/lib/cyber-design-tokens";

const EVENT_DATE = new Date("2026-06-09T09:00:00");

export default function MidPageCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const now = new Date();
    const diff = EVENT_DATE.getTime() - now.getTime();
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: ANIMATION.ease }}
      style={{
        background: COLORS.cyanSubtle,
        borderTop: `1px solid ${COLORS.borderAccent}`,
        borderBottom: `1px solid ${COLORS.borderAccent}`,
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Left, Event info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLORS.cyan,
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.textPrimary,
            }}
          >
            Cyber First Kuwait
            <span style={{ color: COLORS.textMuted, margin: "0 8px" }}>|</span>
            <span style={{ color: COLORS.textTertiary }}>June 9, 2026</span>
          </span>
        </div>

        {/* Center, Countdown */}
        <span
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.cyan,
            letterSpacing: "1px",
          }}
        >
          {daysLeft > 0 ? `${daysLeft} DAYS LEFT` : "EVENT DAY"}
        </span>

        {/* Right, CTA */}
        <a
          href="#register"
          style={{
            padding: "10px 24px",
            borderRadius: RADIUS.round,
            background: COLORS.cyan,
            color: COLORS.bgDeep,
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.3s",
            boxShadow: SHADOWS.cyanGlow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.cyanBright;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = COLORS.cyan;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Register Now
        </a>
      </div>
    </motion.div>
  );
}
