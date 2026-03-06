"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Award Data ──────────────────────────────────────────── */

const awards = [
  {
    num: "01",
    title: "Operational Excellence Leader",
    desc: "Outstanding achievements in implementing operational excellence programs across the organization.",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    num: "02",
    title: "Business Transformation Leader",
    desc: "Successful execution of transformative initiatives for breakthrough performance.",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    num: "03",
    title: "Sustainability & ESG Excellence",
    desc: "Integration of environmentally responsible practices with measurable outcomes.",
    icon: "M12 22c5.5-3.5 10-7.5 10-12A10 10 0 002 10c0 4.5 4.5 8.5 10 12z",
  },
  {
    num: "04",
    title: "Innovation in Process Optimization",
    desc: "Pioneering new methods, tools, or technologies to optimize core processes.",
    icon: "M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93",
  },
  {
    num: "05",
    title: "Finance & Procurement Excellence",
    desc: "Streamlining financial processes for cost savings, compliance, and efficiency.",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  },
  {
    num: "06",
    title: "Customer Experience Transformation",
    desc: "Exceptional improvement in customer-facing operations and service delivery.",
    icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  },
  {
    num: "07",
    title: "Intelligent Automation Leader",
    desc: "Leading adoption of AI, RPA, and intelligent automation in operations.",
    icon: "M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zM4.93 4.93a2 2 0 012.83 0l1.41 1.41A2 2 0 017.76 9.17L6.34 7.76a2 2 0 010-2.83zM19.07 4.93a2 2 0 010 2.83l-1.41 1.41a2 2 0 01-2.83-2.83l1.41-1.41a2 2 0 012.83 0zM12 18a2 2 0 012 2v2a2 2 0 01-4 0v-2a2 2 0 012-2zM2 12a2 2 0 012-2h0a2 2 0 010 4h0a2 2 0 01-2-2zM20 12a2 2 0 012-2h0a2 2 0 010 4h0a2 2 0 01-2-2z",
  },
  {
    num: "08",
    title: "Agentic AI & Transformation",
    desc: "Pioneering autonomous AI agents in business process execution and decision-making.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
];

/* ─── Main Component ──────────────────────────────────────── */

export default function OpexAwards() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const heroAward = awards[0];
  const gridAwards = awards.slice(1);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#07051A",
        padding: "clamp(36px, 4vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Atmospheric layers ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 80% 80%, rgba(124,58,237,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 35% 40% at 10% 60%, rgba(159,103,255,0.03) 0%, transparent 70%)",
        }}
      />
      {/* Dot matrix */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 50,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: VIOLET_BRIGHT,
              marginBottom: 20,
            }}
          >
            Opex Awards
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 4vw, 52px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            Recognizing{" "}
            <span
              className="opex-awards-shimmer"
              style={{
                background: `linear-gradient(110deg, ${VIOLET} 0%, #c4b5fd 40%, #fff 50%, #c4b5fd 60%, ${VIOLET} 100%)`,
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Excellence
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            8 award categories celebrating operational excellence, innovation,
            and leadership worldwide.
          </p>
        </motion.div>

        {/* ── Hero Award Card (first award — spotlight) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          style={{ marginBottom: 20 }}
        >
          <HeroAwardCard award={heroAward} />
        </motion.div>

        {/* ── Remaining Awards Grid ── */}
        <div
          className="opex-awards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {gridAwards.map((award, index) => (
            <motion.div
              key={award.num}
              initial={{ opacity: 0, y: 24 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.6,
                delay: 0.35 + index * 0.07,
                ease: EASE,
              }}
            >
              <AwardCard award={award} />
            </motion.div>
          ))}
        </div>

        {/* ── Stats Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          className="opex-awards-stats"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(124,58,237,0.08)",
          }}
        >
          {[
            { value: "8", label: "Award Categories" },
            { value: "100+", label: "Nominations" },
            { value: "3", label: "Annual Editions" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${VIOLET}, ${VIOLET_BRIGHT})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#505050",
                  marginTop: 6,
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
      </div>

      <style jsx global>{`
        @keyframes opexShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .opex-awards-shimmer {
          animation: opexShimmer 4s ease-in-out infinite;
        }
        @keyframes opexSpinBorder {
          0% {
            --opex-border-angle: 0deg;
          }
          100% {
            --opex-border-angle: 360deg;
          }
        }
        @property --opex-border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @media (max-width: 1024px) {
          .opex-awards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .opex-awards-grid {
            grid-template-columns: 1fr !important;
          }
          .opex-awards-stats {
            gap: 24px !important;
          }
          .opex-hero-award-inner {
            flex-direction: column !important;
            text-align: center !important;
          }
          .opex-hero-award-icon {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Hero Award Card ─────────────────────────────────────── */

function HeroAwardCard({ award }: { award: (typeof awards)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    []
  );

  return (
    <div style={{ position: "relative" }}>
      {/* Animated spinning gradient border */}
      <div
        className="absolute inset-0 rounded-[20px] transition-opacity duration-500"
        style={{
          background: `conic-gradient(from var(--opex-border-angle), ${VIOLET}, #c084fc, #e879f9, #c084fc, ${VIOLET})`,
          animation: "opexSpinBorder 4s linear infinite",
          opacity: isHovered ? 0.6 : 0.2,
          filter: "blur(1px)",
        }}
      />
      <div
        ref={cardRef}
        className="relative transition-all"
        style={{
          margin: 1,
          borderRadius: 19,
          background: "#0c0a24",
          padding: "clamp(28px, 3vw, 44px)",
          overflow: "hidden",
          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 20px 60px rgba(124,58,237,0.15), 0 0 60px rgba(124,58,237,0.06)"
            : "0 4px 20px rgba(0,0,0,0.3)",
          transitionDuration: "0.5s",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: "default",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Cursor-following spotlight */}
        <div
          className="absolute pointer-events-none transition-opacity duration-500"
          style={{
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)`,
            left: `calc(${mousePos.x * 100}% - 175px)`,
            top: `calc(${mousePos.y * 100}% - 175px)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Large faded number watermark */}
        <span
          className="absolute pointer-events-none select-none"
          style={{
            top: -10,
            right: 20,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(120px, 14vw, 200px)",
            fontWeight: 900,
            color: VIOLET,
            opacity: 0.04,
            lineHeight: 1,
          }}
        >
          {award.num}
        </span>

        <div
          className="opex-hero-award-inner"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(24px, 3vw, 44px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Trophy icon */}
          <div
            className="opex-hero-award-icon"
            style={{
              flexShrink: 0,
              width: 88,
              height: 88,
              borderRadius: 20,
              background: `linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))`,
              border: `1px solid rgba(124,58,237,${isHovered ? 0.35 : 0.15})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.4s, box-shadow 0.4s",
              boxShadow: isHovered
                ? `0 0 30px rgba(124,58,237,0.2), inset 0 0 20px rgba(124,58,237,0.05)`
                : "none",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke={VIOLET_BRIGHT}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: isHovered
                  ? `drop-shadow(0 0 8px rgba(124,58,237,0.6)) drop-shadow(0 0 20px rgba(124,58,237,0.3))`
                  : `drop-shadow(0 0 4px rgba(124,58,237,0.3))`,
                transition: "filter 0.4s",
              }}
            >
              <path d={award.icon} />
            </svg>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 50,
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.2)",
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: VIOLET_BRIGHT,
                marginBottom: 12,
              }}
            >
              Grand Award
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 2.5vw, 30px)",
                fontWeight: 800,
                color: "var(--white)",
                margin: "0 0 10px",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {award.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 300,
                color: "#808080",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              {award.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Standard Award Card ─────────────────────────────────── */

function AwardCard({ award }: { award: (typeof awards)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    []
  );

  return (
    <div
      ref={cardRef}
      className="transition-all"
      style={{
        position: "relative",
        padding: "28px 24px",
        background: isHovered
          ? "rgba(124,58,237,0.06)"
          : "rgba(255,255,255,0.015)",
        border: isHovered
          ? "1px solid rgba(124,58,237,0.25)"
          : "1px solid rgba(255,255,255,0.04)",
        borderRadius: 18,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        minHeight: 200,
        overflow: "hidden",
        transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 16px 48px rgba(124,58,237,0.12), 0 0 40px rgba(124,58,237,0.04)"
          : "none",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor-following spotlight */}
      <div
        className="absolute pointer-events-none transition-opacity duration-400"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          left: `calc(${mousePos.x * 100}% - 100px)`,
          top: `calc(${mousePos.y * 100}% - 100px)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 transition-all"
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${VIOLET_BRIGHT}, transparent)`,
          opacity: isHovered ? 0.5 : 0,
          transitionDuration: "0.4s",
        }}
      />

      {/* Large faded number watermark */}
      <span
        className="absolute pointer-events-none select-none"
        style={{
          bottom: -8,
          right: 12,
          fontFamily: "var(--font-display)",
          fontSize: 96,
          fontWeight: 900,
          color: VIOLET,
          opacity: isHovered ? 0.06 : 0.03,
          lineHeight: 1,
          transition: "opacity 0.4s",
        }}
      >
        {award.num}
      </span>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <div
          className="transition-all"
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: isHovered
              ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.08))"
              : "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.03))",
            border: `1px solid rgba(124,58,237,${isHovered ? 0.3 : 0.12})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            transitionDuration: "0.3s",
            boxShadow: isHovered
              ? "0 0 20px rgba(124,58,237,0.15)"
              : "none",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isHovered ? VIOLET_BRIGHT : `${VIOLET}99`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: isHovered
                ? `drop-shadow(0 0 6px rgba(124,58,237,0.5))`
                : "none",
              transition: "stroke 0.3s, filter 0.3s",
            }}
          >
            <path d={award.icon} />
          </svg>
        </div>

        {/* Number */}
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10,
            fontWeight: 700,
            color: VIOLET,
            opacity: 0.5,
            letterSpacing: "1.5px",
          }}
        >
          {award.num}
        </span>

        {/* Title */}
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--white)",
            margin: "8px 0 0",
            lineHeight: 1.3,
          }}
        >
          {award.title}
        </h4>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 300,
            color: "#606060",
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          {award.desc}
        </p>
      </div>
    </div>
  );
}

