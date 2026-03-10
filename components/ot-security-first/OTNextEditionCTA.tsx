"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const OT_CRIMSON = "#D34B9A";
const OT_FIREBRICK = "#E86BB8";

export default function OTNextEditionCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "var(--black)",
        padding: "clamp(80px, 10vw, 130px) 0",
      }}
    >
      {/* Background industrial pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, ${OT_CRIMSON} 25%, transparent 25%),
            linear-gradient(-45deg, ${OT_CRIMSON} 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${OT_CRIMSON} 75%),
            linear-gradient(-45deg, transparent 75%, ${OT_CRIMSON} 75%)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        }}
      />

      <div
        className="relative z-10"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          textAlign: "center",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3"
        >
          <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: OT_FIREBRICK,
            }}
          >
            Next Edition
          </span>
          <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(32px, 4vw, 56px)",
            letterSpacing: "-2px",
            color: "var(--white)",
            lineHeight: 1.1,
            margin: "24px 0 0",
          }}
        >
          Abu Dhabi
          <br />
          <span style={{ color: OT_FIREBRICK }}>2026</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 16,
            fontWeight: 300,
            color: "#808080",
            marginTop: 16,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          The second edition of OT Security First is coming to the UAE capital.
          Date and venue to be announced.
        </motion.p>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center gap-4 flex-wrap"
          style={{ marginTop: 32 }}
        >
          <InfoCard label="Location" value="Abu Dhabi, UAE" />
          <InfoCard label="Date" value="Coming Soon" />
          <InfoCard label="Format" value="In-Person" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center gap-3 flex-wrap"
          style={{ marginTop: 36 }}
        >
          <CTAButton primary>Register Interest</CTAButton>
          <CTAButton>Become a Sponsor</CTAButton>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * InfoCard — Small info card
 */
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--black-card)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: 8,
        padding: "16px 24px",
        minWidth: 140,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#505050",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--white)",
          margin: "6px 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * CTAButton — Angular style button
 */
function CTAButton({
  children,
  primary = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="#register"
      className="inline-flex items-center gap-2 transition-all"
      style={{
        padding: "14px 28px",
        borderRadius: 6,
        background: primary
          ? isHovered
            ? OT_FIREBRICK
            : OT_CRIMSON
          : "transparent",
        border: primary
          ? "none"
          : isHovered
            ? `1px solid ${OT_FIREBRICK}`
            : `1px solid ${OT_CRIMSON}50`,
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: primary ? "var(--white)" : isHovered ? OT_FIREBRICK : "#808080",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {primary && (
        <span
          className="transition-transform"
          style={{
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
            transitionDuration: "0.3s",
          }}
        >
          →
        </span>
      )}
    </Link>
  );
}
