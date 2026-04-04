"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SPACING, GRADIENTS } from "@/lib/cyber-design-tokens";

const EFG_ORANGE = "#E8651A";

// Other series data
const otherSeries = [
  {
    id: "ot-security",
    name: "OT Security First",
    tagline: "Protecting What Runs the World",
    color: "#00C9A7",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    href: "/events/ot-security-first",
  },
  {
    id: "data-ai",
    name: "Digital First",
    tagline: "Intelligence at the Speed of Business",
    color: "#EEEEEE",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    href: "/events/data-ai-first",
  },
  {
    id: "opex",
    name: "Opex First",
    tagline: "Operational Excellence for the Modern Enterprise",
    color: "#9B4D96",
    image:
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=600&q=80",
    href: "/events/opex-first",
  },
];

export default function ExploreOtherSeries() {
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
          transition={{ duration: 0.6, ease: ANIMATION.ease }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          {/* Label, Orange for EFG parent brand */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: EFG_ORANGE }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: EFG_ORANGE,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              From Events First Group
            </span>
            <span style={{ width: 30, height: 1, background: EFG_ORANGE }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              letterSpacing: "-1.5px",
              color: COLORS.textPrimary,
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Explore Our Other Series
          </h2>
        </motion.div>

        {/* Series Cards Grid */}
        <div
          className="other-series-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: SPACING.gridGapDefault,
          }}
        >
          {otherSeries.map((series, index) => (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: ANIMATION.ease,
              }}
            >
              <SeriesCard series={series} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .other-series-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * SeriesCard, Mini event series portal card
 */
function SeriesCard({ series }: { series: (typeof otherSeries)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={series.href}
      className="block relative overflow-hidden cursor-pointer transition-all"
      style={{
        aspectRatio: "3 / 2",
        background: COLORS.bgCard,
        border: isHovered
          ? `1px solid ${series.color}1A`
          : `1px solid ${COLORS.borderSubtle}`,
        borderRadius: RADIUS.lg,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 z-10 transition-all"
        style={{
          height: 3,
          background: series.color,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transitionDuration: "0.4s",
        }}
      />

      {/* Background Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={series.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-all"
          style={{
            filter: isHovered
              ? "brightness(0.25) saturate(0.7)"
              : "brightness(0.15) saturate(0.5)",
            transform: isHovered ? "scale(1.04)" : "scale(1)",
            transitionDuration: "0.6s",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(10, 10, 10, 0.9) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: 24 }}
      >
        <h3
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontSize: 22,
            fontWeight: 800,
            color: COLORS.textPrimary,
            margin: 0,
          }}
        >
          {series.name}
        </h3>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 13,
            fontWeight: 300,
            color: COLORS.textSecondary,
            marginTop: 4,
          }}
        >
          {series.tagline}
        </p>

        {/* Arrow on hover */}
        <span
          className="transition-all"
          style={{
            display: "inline-block",
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 14,
            color: series.color,
            marginTop: 10,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-8px)",
            transitionDuration: "0.3s",
          }}
        >
          Explore →
        </span>
      </div>
    </Link>
  );
}
