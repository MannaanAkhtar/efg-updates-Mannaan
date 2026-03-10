"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { DotMatrixGrid } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE, NARROW, WIDE } from "./constants";

const roles = [
  "Chief Data Officer",
  "Chief AI Officer",
  "Chief Information Officer",
  "Chief Technology Officer",
  "Chief Digital Officer",
  "Head of Data Science / Analytics",
  "Head of Machine Learning / AI",
  "Data Architect / AI Architect",
  "Director of Data Engineering",
  "Head of Digital Transformation",
];

const industries = [
  "Government & Public Sector",
  "Banking & Financial Services",
  "Energy & Utilities",
  "Healthcare & Pharmaceuticals",
  "Telecommunications & IT",
  "Retail & E-Commerce",
  "Education & Research",
  "Manufacturing",
  "Transportation & Logistics",
  "Media & Entertainment",
];

export default function DAAudience() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#111111",
        padding: "clamp(36px, 5vw, 56px) 24px",
      }}
    >
      {/* Diagonal grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(15,115,94,0.03) 1px, transparent 1px),
            linear-gradient(-30deg, rgba(15,115,94,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          zIndex: 1,
        }}
      />

      {/* Emerald glow — right center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 50% at 85% 50%, ${EMERALD}08 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <DotMatrixGrid color={EMERALD} opacity={0.01} spacing={36} />

      {/* Intro */}
      <div style={{ maxWidth: NARROW, margin: "0 auto 48px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
          style={{ marginBottom: 16 }}
        >
          <span style={{ width: 30, height: 2, background: EMERALD }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: EMERALD,
            }}
          >
            Audience
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 800,
            color: "var(--white)",
            margin: 0,
            letterSpacing: "-1px",
          }}
        >
          Who Should Attend
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 17,
            fontWeight: 300,
            color: "#808080",
            lineHeight: 1.7,
            marginTop: 16,
          }}
        >
          Data & AI First is designed for the people who decide how
          organizations adopt AI. Not observers — operators.
        </motion.p>
      </div>

      {/* Two columns */}
      <div
        className="da-audience-grid"
        style={{
          maxWidth: WIDE,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          {/* Card wrapper */}
          <div
            style={{
              background: "rgba(15,115,94,0.03)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${EMERALD}10`,
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: EMERALD_BRIGHT,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: EMERALD,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Roles
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {roles.map((role, i) => (
                <AudienceItem key={role} label={role} delay={i * 0.03} isInView={isInView} />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          {/* Card wrapper */}
          <div
            style={{
              background: "rgba(15,115,94,0.03)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${EMERALD}10`,
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: EMERALD_BRIGHT,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: EMERALD,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Industries
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {industries.map((ind, i) => (
                <AudienceItem key={ind} label={ind} delay={i * 0.03} isInView={isInView} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        style={{ textAlign: "center", marginTop: 36, position: "relative", zIndex: 1 }}
      >
        <a
          href="#register"
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            fontWeight: 500,
            color: EMERALD,
            textDecoration: "none",
            letterSpacing: "0.3px",
          }}
        >
          See Yourself Here? Register →
        </a>
      </motion.div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .da-audience-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

function AudienceItem({
  label,
  delay,
  isInView,
}: {
  label: string;
  delay: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.3 + delay, ease: EASE }}
      className="flex items-center gap-3 transition-all"
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        background: isHovered ? `${EMERALD}08` : "transparent",
        borderLeft: isHovered ? `2px solid ${EMERALD}60` : "2px solid transparent",
        cursor: "default",
        transitionDuration: "0.25s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="transition-all"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: EMERALD,
          opacity: isHovered ? 1 : 0.4,
          boxShadow: isHovered ? `0 0 8px ${EMERALD}60` : "none",
          flexShrink: 0,
          transitionDuration: "0.2s",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 15,
          color: isHovered ? "#d0d0d0" : "#909090",
          transition: "color 0.2s",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}
