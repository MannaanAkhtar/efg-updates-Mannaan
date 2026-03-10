"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const EASE = [0.16, 1, 0.3, 1] as const;

const topics = [
  {
    num: "01",
    title: "Digital Transformation & AI",
    desc: "Integrating AI, IoT, and automation into operations for next-generation productivity.",
  },
  {
    num: "02",
    title: "Agentic AI & Automation",
    desc: "Autonomous AI agents executing complex business processes.",
  },
  {
    num: "03",
    title: "Process Excellence & Optimization",
    desc: "Lean, Six Sigma, BPM, and continuous improvement methodologies.",
  },
  {
    num: "04",
    title: "Supply Chain Resilience",
    desc: "Building agile, transparent, and disruption-proof supply chains.",
  },
  {
    num: "05",
    title: "Sustainability & ESG",
    desc: "Embedding environmentally responsible practices into operations.",
  },
  {
    num: "06",
    title: "Giga-Project Operations",
    desc: "Operational strategies for mega-projects — NEOM, Qiddiya, Masdar.",
  },
  {
    num: "07",
    title: "Public-Private Synergies",
    desc: "Bridging government vision and private sector execution.",
  },
  {
    num: "08",
    title: "Workforce Transformation",
    desc: "Upskilling, culture change, and high-performance teams.",
  },
  {
    num: "09",
    title: "Finance & Procurement Excellence",
    desc: "Streamlining financial processes and strategic procurement.",
  },
  {
    num: "10",
    title: "Operational Agility",
    desc: "Building organizations that adapt and thrive in volatile environments.",
  },
];

const stats = [
  { value: "$27B", label: "Saudi digital economy investment" },
  { value: "AED 300B", label: "UAE industrial GDP target by 2031" },
  { value: "$3.3T", label: "Investment pipeline" },
  { value: "19%", label: "Digital economy's target GDP contribution" },
];

export default function OpexKeyThemes() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4vw, 56px) 0",
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
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: VIOLET }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: VIOLET,
                fontFamily: "var(--font-outfit)",
              }}
            >
              Key Themes
            </span>
            <span style={{ width: 30, height: 1, background: VIOLET }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            What Opex First Covers
          </h2>
        </motion.div>

        {/* Theme Cards Grid */}
        <div
          className="opex-themes-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 14,
          }}
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic.num}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{
                duration: 0.5,
                delay: 0.15 + index * 0.06,
                ease: EASE,
              }}
            >
              <ThemeCard topic={topic} />
            </motion.div>
          ))}
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          className="opex-stats-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginTop: 48,
            padding: "32px 0",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 2.5vw, 36px)",
                  fontWeight: 800,
                  color: VIOLET,
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  color: "#606060",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1100px) {
          .opex-themes-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .opex-themes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-stats-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .opex-themes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ThemeCard({ topic }: { topic: (typeof topics)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="transition-all"
      style={{
        padding: "20px 18px",
        background: isHovered
          ? "rgba(124,58,237,0.06)"
          : "rgba(255,255,255,0.02)",
        border: isHovered
          ? "1px solid rgba(124,58,237,0.15)"
          : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 12,
        borderLeft: isHovered
          ? `3px solid ${VIOLET}`
          : "3px solid transparent",
        minHeight: 140,
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 700,
          color: VIOLET,
          opacity: 0.6,
        }}
      >
        {topic.num}
      </span>
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 700,
          color: "var(--white)",
          margin: "8px 0 0",
          lineHeight: 1.3,
        }}
      >
        {topic.title}
      </h4>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: 300,
          color: "#606060",
          marginTop: 6,
          lineHeight: 1.5,
        }}
      >
        {topic.desc}
      </p>
    </div>
  );
}
