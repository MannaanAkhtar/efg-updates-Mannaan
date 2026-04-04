"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING } from "@/lib/cyber-design-tokens";

// Roles data
const roles = [
  "Chief Information Security Officer (CISO)",
  "Chief Information Officer (CIO)",
  "Chief Technology Officer (CTO)",
  "Head of Cybersecurity",
  "Head of IT / Infrastructure",
  "Head of Risk & Compliance",
  "Head of Cloud Security",
  "Security Architects",
  "Head of Digital Transformation",
  "Director, Threat Intelligence",
];

// Industries data
const industries = [
  "Banking & Financial Services",
  "Energy & Utilities",
  "Government & Public Sector",
  "Healthcare & Pharmaceuticals",
  "Telecommunications",
  "Manufacturing",
  "Retail & E-Commerce",
  "Education & Research",
  "Defense & Intelligence",
  "Critical Infrastructure",
];

export default function WhoShouldAttend() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgDeep,
        padding: `${SPACING.sectionPaddingLarge} 0`,
      }}
    >
      <div
        className="who-attend-container"
        style={{
          maxWidth: SPACING.maxWidth,
          margin: "0 auto",
          padding: `0 ${SPACING.containerPadding}`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
        }}
      >
        {/* Left Column, Pitch */}
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
              Who Should Attend
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
            Built for Decision-Makers
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
            Cyber First is designed exclusively for senior technology and
            security leaders. If your role involves protecting digital assets,
            managing cyber risk, or shaping security strategy, this is your
            event.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: 0.4, ease: ANIMATION.ease }}
            style={{ marginTop: 28 }}
          >
            <RegisterButton />
          </motion.div>
        </motion.div>

        {/* Right Column, Lists */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.2, ease: ANIMATION.ease }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {/* Roles List */}
          <div>
            <h3
              style={{
                fontFamily: TYPOGRAPHY.fontBody,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: COLORS.textTertiary,
                marginBottom: 16,
              }}
            >
              Roles
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {roles.map((role, index) => (
                <ListItem key={role} item={role} delay={index * 0.03} isInView={isInView} />
              ))}
            </ul>
          </div>

          {/* Industries List */}
          <div>
            <h3
              style={{
                fontFamily: TYPOGRAPHY.fontBody,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: COLORS.textTertiary,
                marginBottom: 16,
              }}
            >
              Industries
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {industries.map((industry, index) => (
                <ListItem key={industry} item={industry} delay={index * 0.03} isInView={isInView} />
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .who-attend-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ListItem, Individual list item with hover effect
 */
function ListItem({
  item,
  delay,
  isInView,
}: {
  item: string;
  delay: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.4, delay: 0.3 + delay, ease: ANIMATION.ease }}
      className="flex items-start gap-2.5 transition-colors"
      style={{
        fontFamily: TYPOGRAPHY.fontBody,
        fontSize: 14,
        fontWeight: 400,
        color: isHovered ? COLORS.textPrimary : COLORS.textSecondary,
        lineHeight: 2.2,
        cursor: "default",
        transitionDuration: "0.2s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="transition-transform"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: COLORS.cyan,
          marginTop: 10,
          flexShrink: 0,
          transform: isHovered ? "scale(1.3)" : "scale(1)",
          transitionDuration: "0.2s",
        }}
      />
      {item}
    </motion.li>
  );
}

/**
 * RegisterButton, CTA button
 */
function RegisterButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="#register"
      className="inline-flex items-center gap-2 transition-all duration-300"
      style={{
        padding: "14px 32px",
        borderRadius: RADIUS.round,
        background: isHovered ? COLORS.cyanBright : COLORS.cyan,
        color: COLORS.bgDeep,
        fontFamily: TYPOGRAPHY.fontBody,
        fontSize: 15,
        fontWeight: 600,
        boxShadow: isHovered ? SHADOWS.cyanGlowHover : SHADOWS.cyanGlow,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>Check If You Qualify</span>
      <span
        className="transition-transform"
        style={{
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          transitionDuration: "0.3s",
        }}
      >
        →
      </span>
    </Link>
  );
}
