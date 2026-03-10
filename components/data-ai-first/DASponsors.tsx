"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { DotMatrixGrid } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE } from "./constants";

// Pre-launch placeholder tiers
const sponsorTiers = [
  { tier: "Patronage", slots: 1 },
  { tier: "Knowledge Partner", slots: 1 },
  { tier: "Supporting Partners", slots: 4 },
];

export default function DASponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "var(--black)",
        padding: "clamp(48px, 6vw, 80px) 0",
      }}
    >
      {/* Texture: Dot Matrix */}
      <DotMatrixGrid color={EMERALD} opacity={0.015} spacing={32} />

      {/* Gradient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "30%",
          right: "-10%",
          background: `radial-gradient(ellipse at center, rgba(15,115,94,0.035) 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 2, background: EMERALD }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: EMERALD_BRIGHT,
              }}
            >
              Partners
            </span>
            <span style={{ width: 30, height: 2, background: EMERALD }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "20px 0 0",
            }}
          >
            Partner with
            <br />
            <span style={{ color: EMERALD_BRIGHT }}>Data & AI First</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 16,
              fontWeight: 300,
              color: "#606060",
              maxWidth: 500,
              margin: "16px auto 0",
              lineHeight: 1.6,
            }}
          >
            Founding partners shape the future of AI leadership.
            Secure your position at the table.
          </p>
        </motion.div>

        {/* Placeholder Tiers */}
        {sponsorTiers.map((tierData, tierIndex) => (
          <motion.div
            key={tierData.tier}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + tierIndex * 0.15 }}
            style={{ marginBottom: tierIndex < sponsorTiers.length - 1 ? 32 : 0 }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: tierIndex === 0 ? EMERALD : "#404040",
                marginBottom: 16,
              }}
            >
              {tierData.tier}
            </p>
            <div
              className="da-sponsor-slots"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(tierData.slots, 4)}, 1fr)`,
                gap: 12,
              }}
            >
              {Array.from({ length: tierData.slots }).map((_, i) => (
                <PlaceholderSlot key={i} isPrimary={tierIndex === 0} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          style={{ marginTop: 40, textAlign: "center" }}
        >
          <SponsorCTA />
        </motion.div>
      </div>
    </section>
  );
}

function PlaceholderSlot({ isPrimary = false }: { isPrimary?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        background: isPrimary ? `${EMERALD}08` : "rgba(15, 115, 94, 0.03)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: isHovered
          ? `1px dashed ${EMERALD}40`
          : isPrimary
            ? `1px dashed ${EMERALD}25`
            : "1px dashed rgba(255, 255, 255, 0.06)",
        borderRadius: 14,
        padding: "32px 20px",
        minHeight: isPrimary ? 100 : 80,
        cursor: "default",
        transitionDuration: "0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: 400,
          color: isHovered ? `${EMERALD}80` : "#303030",
          transition: "color 0.2s",
        }}
      >
        Your brand here
      </span>
    </div>
  );
}

function SponsorCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/sponsors-and-partners"
      className="inline-flex items-center gap-2 transition-all"
      style={{
        padding: "14px 28px",
        borderRadius: 50,
        border: isHovered
          ? `1px solid ${EMERALD_BRIGHT}`
          : `1px solid ${EMERALD}40`,
        background: isHovered ? `${EMERALD}15` : "transparent",
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: EMERALD_BRIGHT,
        transitionDuration: "0.4s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>Become a Founding Partner</span>
      <span
        className="transition-transform"
        style={{
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          transitionDuration: "0.3s",
        }}
      >
        &rarr;
      </span>
    </Link>
  );
}
