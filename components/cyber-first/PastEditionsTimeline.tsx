"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING, GRADIENTS } from "@/lib/cyber-design-tokens";

// Who's in the room — role breakdown
const roles = [
  { title: "CISOs & CSOs", percentage: 32, description: "Chief Information Security Officers leading enterprise cyber strategy" },
  { title: "CTO & CIO", percentage: 22, description: "Technology executives driving digital transformation securely" },
  { title: "Government Cyber Leaders", percentage: 18, description: "National cybersecurity authority heads and policy makers" },
  { title: "Security Architects", percentage: 15, description: "Hands-on leaders designing defence frameworks" },
  { title: "Vendor & Solution Leads", percentage: 13, description: "Technology partners showcasing next-gen security solutions" },
];

// Big proof numbers
const proofStats = [
  { value: 1500, suffix: "+", label: "Senior Security Leaders" },
  { value: 5, suffix: "+", label: "Nations" },
  { value: 120, suffix: "+", label: "Organisations Represented" },
  { value: 92, suffix: "%", label: "Director-Level & Above" },
];

// Easing function: easeOutExpo
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export default function PastEditionsTimeline() {
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
              The Room
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
            You&rsquo;ll Know the People in This Room
          </h2>

          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textTertiary,
              maxWidth: 600,
              margin: "16px auto 0",
            }}
          >
            Cyber First doesn&rsquo;t fill seats — it curates a room. Every
            attendee is a decision-maker shaping enterprise cybersecurity.
          </p>
        </motion.div>

        {/* Proof Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.15, ease: ANIMATION.ease }}
          className="the-room-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: SPACING.gridGapLarge,
            marginBottom: 56,
          }}
        >
          {proofStats.map((stat, i) => (
            <ProofStat key={stat.label} stat={stat} delay={i * 120} isInView={isInView} />
          ))}
        </motion.div>

        {/* Role Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3, ease: ANIMATION.ease }}
          className="the-room-roles"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: SPACING.gridGapSmall,
          }}
        >
          {roles.map((role, i) => (
            <RoleCard key={role.title} role={role} index={i} isInView={isInView} />
          ))}
        </motion.div>

        {/* Bottom Statement */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.7, delay: 0.5, ease: ANIMATION.ease }}
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontWeight: 400,
            fontSize: 15,
            color: COLORS.textTertiary,
            textAlign: "center",
            marginTop: 40,
            letterSpacing: "0.3px",
          }}
        >
          This is not a conference audience. This is your peer group.
        </motion.p>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .the-room-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .the-room-roles {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .the-room-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .the-room-roles {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ProofStat — Animated counting stat
 */
function ProofStat({
  stat,
  delay,
  isInView,
}: {
  stat: { value: number; suffix: string; label: string };
  delay: number;
  isInView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [showSuffix, setShowSuffix] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);

    const startTime = Date.now() + delay;
    const duration = 1800;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setDisplayValue(Math.floor(easedProgress * stat.value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(stat.value);
        if (stat.suffix) setTimeout(() => setShowSuffix(true), 50);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, started, stat.value, stat.suffix, delay]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "28px 16px",
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.borderAccent}`,
        borderRadius: RADIUS.md,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          fontWeight: 800,
          fontSize: "clamp(28px, 3vw, 36px)",
          color: COLORS.textPrimary,
          lineHeight: 1,
        }}
      >
        {displayValue.toLocaleString()}
        {stat.suffix && (
          <span
            style={{
              color: COLORS.cyan,
              display: "inline-block",
              transform: showSuffix ? "scale(1)" : "scale(1.3)",
              opacity: showSuffix ? 1 : 0,
              transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
            }}
          >
            {stat.suffix}
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontBody,
          fontSize: 12,
          fontWeight: 500,
          color: COLORS.textMuted,
          marginTop: 8,
          letterSpacing: "0.5px",
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}

/**
 * RoleCard — Audience role breakdown with bar
 */
function RoleCard({
  role,
  index,
  isInView,
}: {
  role: { title: string; percentage: number; description: string };
  index: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.35 + index * ANIMATION.staggerDefault, ease: ANIMATION.ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: SPACING.cardPaddingCompact,
        background: hovered ? COLORS.bgCardHover : COLORS.bgCard,
        border: `1px solid ${hovered ? COLORS.borderAccent : COLORS.borderSubtle}`,
        borderRadius: RADIUS.md,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
    >
      {/* Percentage */}
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          fontWeight: 800,
          fontSize: 28,
          color: COLORS.cyan,
          margin: 0,
          lineHeight: 1,
        }}
      >
        {role.percentage}%
      </p>

      {/* Title */}
      <h3
        style={{
          fontFamily: TYPOGRAPHY.fontDisplay,
          fontWeight: 700,
          fontSize: 15,
          color: COLORS.textPrimary,
          margin: "12px 0 0",
          lineHeight: 1.3,
        }}
      >
        {role.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontBody,
          fontWeight: 300,
          fontSize: 13,
          color: COLORS.textTertiary,
          margin: "8px 0 0",
          lineHeight: 1.6,
        }}
      >
        {role.description}
      </p>

      {/* Percentage Bar */}
      <div
        style={{
          marginTop: 16,
          height: 3,
          background: COLORS.borderSubtle,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${role.percentage}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: ANIMATION.ease }}
          style={{
            height: "100%",
            background: GRADIENTS.cyanBar,
            borderRadius: 2,
          }}
        />
      </div>
    </motion.div>
  );
}
