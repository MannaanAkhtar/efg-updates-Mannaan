"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";

// SVG icons for each experience element
const icons = {
  microphone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  wrench: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  trophy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  people: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  monitor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  network: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" />
      <line x1="12" y1="8" x2="19" y2="16" />
    </svg>
  ),
};

// 6 experience elements per spec
const elements = [
  {
    id: 1,
    icon: icons.microphone,
    title: "Keynotes & Leadership Panels",
    description:
      "High-level discussions featuring heads of OT security from ADNOC, DP World, KNPC, Oman LNG, and regional energy operators.",
  },
  {
    id: 2,
    icon: icons.wrench,
    title: "Hands-On Workshops",
    description:
      "ICS hacking simulation labs, zero-trust segmentation exercises, and applied OT security training with real-world scenarios.",
  },
  {
    id: 3,
    icon: icons.trophy,
    title: "OT Security Awards",
    description:
      "Recognizing excellence in OT Innovation, IT/OT Convergence, Women in OT Security, Ransomware Defense, and Critical Infrastructure Resilience.",
  },
  {
    id: 4,
    icon: icons.people,
    title: "Curated 1-on-1 Meetings",
    description:
      "Pre-scheduled meetings between asset owners and OT security vendors. Every meeting curated for industrial sector relevance.",
  },
  {
    id: 5,
    icon: icons.monitor,
    title: "Live Technology Demos",
    description:
      "Vendor demonstrations of ICS monitoring, anomaly detection, network segmentation, and industrial incident response tools.",
  },
  {
    id: 6,
    icon: icons.network,
    title: "Industry Networking",
    description:
      "Structured sessions connecting OT security professionals, SCADA engineers, control system architects, and industrial cyber leaders.",
  },
];

export default function OTExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#111111",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Backdrop photo — barely visible */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://otsecurityfirst.com/wp-content/uploads/2025/10/overview1@2x-1024x534.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.08)",
          pointerEvents: "none",
        }}
      />
      {/* Dot-matrix pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(211,75,154,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Crimson glow — top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 15% 30%, ${OT_CRIMSON}12 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative" as const,
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: OT_CRIMSON,
              }}
            >
              The Experience
            </span>
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
          </div>

          {/* Title */}
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
            The Full Arsenal
          </h2>
        </motion.div>

        {/* Elements Grid - 3 columns */}
        <div
          className="experience-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {elements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ExperienceCard element={element} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: OT_CRIMSON,
              textDecoration: "none",
              letterSpacing: "0.5px",
            }}
          >
            Choose Your Experience →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .experience-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .experience-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ExperienceCard — Individual experience element (angular 8px radius)
 */
function ExperienceCard({ element }: { element: (typeof elements)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative transition-all"
      style={{
        background: "#141414",
        border: isHovered
          ? `1px solid ${OT_CRIMSON}40`
          : "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: 8,
        padding: 28,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left edge bar on hover */}
      <div
        className="absolute left-0 top-4 bottom-4 transition-all"
        style={{
          width: 3,
          background: OT_CRIMSON,
          opacity: isHovered ? 1 : 0,
          borderRadius: 2,
          transitionDuration: "0.3s",
        }}
      />

      {/* Icon */}
      <div
        className="transition-all"
        style={{
          width: 44,
          height: 44,
          borderRadius: 6,
          background: isHovered
            ? `${OT_CRIMSON}25`
            : `${OT_CRIMSON}14`,
          border: `1px solid ${OT_CRIMSON}${isHovered ? "4D" : "25"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          transitionDuration: "0.3s",
          color: OT_CRIMSON,
        }}
      >
        {element.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--white)",
          margin: 0,
        }}
      >
        {element.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: 300,
          lineHeight: 1.6,
          color: "#707070",
          margin: "10px 0 0",
        }}
      >
        {element.description}
      </p>
    </div>
  );
}
