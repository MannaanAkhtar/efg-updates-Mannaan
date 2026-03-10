"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const EFG_ORANGE = "#E8651A";
const OT_CRIMSON = "#D34B9A";

// Other series (cross-sell)
const otherSeries = [
  {
    id: "cyber-first",
    name: "Cyber First",
    tagline: "Enterprise Cybersecurity Leadership",
    color: "#01BBF5",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    href: "/events/cyber-first",
  },
  {
    id: "data-ai",
    name: "Data & AI First",
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

export default function OTExploreOtherSeries() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(48px, 6vw, 80px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: EFG_ORANGE }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: EFG_ORANGE,
                fontFamily: "var(--font-outfit)",
              }}
            >
              From Events First Group
            </span>
            <span style={{ width: 30, height: 1, background: EFG_ORANGE }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
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
            gap: 16,
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
                ease: [0.16, 1, 0.3, 1],
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
 * SeriesCard — Mini event series portal card (angular style for OT)
 */
function SeriesCard({ series }: { series: (typeof otherSeries)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={series.href}
      className="block relative overflow-hidden cursor-pointer transition-all"
      style={{
        aspectRatio: "3 / 2",
        background: "#141414",
        border: isHovered
          ? `1px solid ${series.color}25`
          : "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: 10,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left edge accent (angular OT style) */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 transition-all"
        style={{
          width: 3,
          background: series.color,
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.3s",
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
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 800,
            color: "var(--white)",
            margin: 0,
          }}
        >
          {series.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 300,
            color: "#808080",
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
            fontFamily: "var(--font-outfit)",
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
