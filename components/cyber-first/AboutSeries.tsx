"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING } from "@/lib/cyber-design-tokens";

// Outcome cards — what attendees walk away with
const outcomes = [
  {
    id: "intelligence",
    number: "01",
    title: "Actionable Threat Intelligence",
    description:
      "Real threat briefings from practitioners defending enterprise networks right now. Leave with a playbook, not just notes.",
  },
  {
    id: "peer-access",
    number: "02",
    title: "Direct Access to Your Peers",
    description:
      "Structured roundtables and closed-door sessions with CISOs facing the same regulatory and operational challenges you do.",
  },
  {
    id: "vendor-clarity",
    number: "03",
    title: "Vendor Clarity, Not Noise",
    description:
      "Curated solution showcases from vetted partners. No expo-floor chaos — just focused demos matched to real enterprise use cases.",
  },
  {
    id: "regulatory",
    number: "04",
    title: "Regulatory Foresight",
    description:
      "Hear directly from national cyber authorities. Know what's coming before it's mandated — from NESA to NCA and beyond.",
  },
  {
    id: "partnerships",
    number: "05",
    title: "Partnerships That Compound",
    description:
      "Every edition is a reunion. The relationships built at Cyber First create a global security network that works.",
  },
  {
    id: "strategy",
    number: "06",
    title: "Board-Ready Frameworks",
    description:
      "Sessions designed for leaders who report to boards. Take back metrics and narratives that translate security into business language.",
  },
];

export default function AboutSeries() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgDeep,
        padding: `${SPACING.sectionPadding} 0`,
      }}
    >
      <div
        style={{
          maxWidth: SPACING.maxWidth,
          margin: "0 auto",
          padding: `0 ${SPACING.containerPadding}`,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: ANIMATION.ease }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              Outcomes
            </span>
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              ...TYPOGRAPHY.sectionTitle,
              color: COLORS.textPrimary,
              margin: "16px 0 0",
            }}
          >
            What You Walk Away With
          </h2>

          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textTertiary,
              maxWidth: 580,
              margin: "16px auto 0",
            }}
          >
            Every element of Cyber First is designed for one thing — giving
            senior security leaders something they can use the moment they
            return to their desks.
          </p>
        </motion.div>

        {/* Outcomes Grid */}
        <div
          className="outcomes-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: SPACING.gridGapDefault,
          }}
        >
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{
                duration: 0.6,
                delay: 0.15 + index * ANIMATION.staggerDefault,
                ease: ANIMATION.ease,
              }}
            >
              <OutcomeCard outcome={outcome} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .outcomes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .outcomes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * OutcomeCard — Single outcome with hover effect
 */
function OutcomeCard({
  outcome,
}: {
  outcome: { number: string; title: string; description: string };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: SPACING.cardPadding,
        background: hovered ? COLORS.bgCardHover : COLORS.bgCard,
        border: `1px solid ${hovered ? COLORS.borderAccent : COLORS.borderSubtle}`,
        borderRadius: RADIUS.lg,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? SHADOWS.cardHover : "none",
        cursor: "default",
        height: "100%",
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          fontWeight: 800,
          fontSize: 13,
          color: hovered ? COLORS.cyan : COLORS.borderAccentHover,
          transition: "color 0.3s",
          letterSpacing: "1px",
        }}
      >
        {outcome.number}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          ...TYPOGRAPHY.cardTitle,
          color: COLORS.textPrimary,
          margin: "14px 0 0",
        }}
      >
        {outcome.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontBody,
          ...TYPOGRAPHY.bodyDefault,
          color: COLORS.textTertiary,
          margin: "10px 0 0",
        }}
      >
        {outcome.description}
      </p>
    </div>
  );
}
