"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

// 10 themes
const themes = [
  {
    id: 1,
    title: "AI-Powered OT Threat Hunting",
    description:
      "Leveraging artificial intelligence for anomaly detection, predictive maintenance, and alarm triage across industrial control systems.",
  },
  {
    id: 2,
    title: "Secure Renewables",
    description:
      "OT security strategies for solar farms, wind installations, and the expanding renewable energy infrastructure.",
  },
  {
    id: 3,
    title: "Ransomware Defense for Energy Operations",
    description:
      "Protecting operational continuity against targeted ransomware campaigns hitting oil, gas, and utilities.",
  },
  {
    id: 4,
    title: "Supply Chain Security in Oil & Gas",
    description:
      "Securing the extended enterprise from third-party risks, vendor compromises, and pipeline integrity threats.",
  },
  {
    id: 5,
    title: "Legacy-to-Zero-Trust Migration",
    description:
      "Transitioning aging ICS/SCADA infrastructure to zero-trust architecture without disrupting operations.",
  },
  {
    id: 6,
    title: "Incident Response Drills",
    description:
      "Tabletop exercises and live simulations for OT-specific cyber incidents and crisis management.",
  },
  {
    id: 7,
    title: "6G & Edge Computing Risks",
    description:
      "Securing next-generation connectivity at the industrial edge where IT and OT converge.",
  },
  {
    id: 8,
    title: "CISO-Led OT Governance",
    description:
      "Building board-level OT security programmes, budgets, and risk reporting frameworks.",
  },
  {
    id: 9,
    title: "Quantum-Resistant Cryptography",
    description:
      "Preparing industrial control systems for the post-quantum threat landscape.",
  },
  {
    id: 10,
    title: "Women in OT Security",
    description:
      "Advancing diversity and inclusion in the traditionally underrepresented OT security workforce.",
  },
];

export default function OTAboutSeries() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal grid pattern, industrial SCADA feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(211,75,154,0.07) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(211,75,154,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial crimson glow, bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 10% 80%, ${OT_CRIMSON}18 0%, transparent 70%)`,
        }}
      />

      <div
        className="relative z-10"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Asymmetric layout: Left intro + Right themes */}
        <div
          className="about-series-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* LEFT, Sticky intro */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="about-series-intro"
            style={{ position: "sticky", top: 100 }}
          >
            {/* Label */}
            <div className="flex items-center gap-3">
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
                About the Series
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(28px, 3vw, 40px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: "20px 0 0",
              }}
            >
              Where IT Meets the Physical World
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "#808080",
                marginTop: 20,
              }}
            >
              The only platform in the MENA region dedicated exclusively to
              operational technology security, integrating cutting-edge
              technologies, fostering regional expertise, and driving actionable
              strategies to protect ICS, SCADA, and Industrial IoT environments.
            </p>

            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.7,
                color: "#606060",
                marginTop: 12,
              }}
            >
              This isn&rsquo;t cybersecurity in the abstract. This is about protecting
              the systems that keep the lights on, the oil flowing, and the water
              clean.
            </p>

            {/* CTA */}
            <a
              href="#register"
              className="inline-flex items-center gap-2 transition-all"
              style={{
                marginTop: 28,
                padding: "10px 20px",
                background: "transparent",
                border: `1px solid ${OT_CRIMSON}`,
                borderRadius: 6,
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: OT_CRIMSON,
                textDecoration: "none",
              }}
            >
              Explore the Full Agenda →
            </a>
          </motion.div>

          {/* RIGHT, Themes grid */}
          <div>
            {/* Themes label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
              style={{ marginBottom: 20 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#585858",
                }}
              >
                10 Key Themes
              </span>
            </motion.div>

            {/* Themes Grid, 2 columns */}
            <div
              className="about-themes-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {themes.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.05,
                    ease: EASE,
                  }}
                >
                  <ThemeCard theme={theme} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .about-series-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .about-series-intro {
            position: static !important;
            text-align: center;
          }
        }
        @media (max-width: 600px) {
          .about-themes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ThemeCard, Individual theme card with left-edge crimson bar
 */
function ThemeCard({
  theme,
  index,
}: {
  theme: (typeof themes)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative transition-all"
      style={{
        background: "#141414",
        border: `1px solid ${isHovered ? `${OT_CRIMSON}20` : "rgba(255, 255, 255, 0.04)"}`,
        borderRadius: 8,
        padding: "20px 24px",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left edge bar */}
      <div
        className="absolute left-0 top-3 bottom-3 transition-all"
        style={{
          width: 3,
          background: OT_CRIMSON,
          opacity: isHovered ? 1 : 0,
          borderRadius: 2,
          transitionDuration: "0.3s",
        }}
      />

      {/* Number + Title row */}
      <div className="flex items-start gap-3">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: 800,
            color: isHovered ? OT_CRIMSON : "#353535",
            minWidth: 20,
            transition: "color 0.3s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 700,
              color: isHovered ? "var(--white)" : "#d0d0d0",
              margin: 0,
              transition: "color 0.3s",
            }}
          >
            {theme.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.6,
              color: "#606060",
              marginTop: 6,
            }}
          >
            {theme.description}
          </p>
        </div>
      </div>
    </div>
  );
}
