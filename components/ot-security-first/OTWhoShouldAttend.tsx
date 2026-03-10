"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const OT_CRIMSON = "#D34B9A";
const OT_FIREBRICK = "#E86BB8";

// Roles per spec
const roles = [
  "VP/Director Industrial Cybersecurity",
  "Chief Information Security Officer",
  "Head of OT Security",
  "Director Control Systems Security",
  "ICS Security Manager",
  "SCADA Engineers",
  "Incident Response Lead (OT)",
  "CIP Manager",
  "Head IT/OT Integration",
  "Cybersecurity Architect (OT/ICS)",
];

// Industries per spec
const industries = [
  "Oil & Gas",
  "Power Generation",
  "Water & Wastewater",
  "Renewable Energy",
  "Petrochemicals",
  "Mining & Metals",
  "Transportation & Logistics",
  "Nuclear Energy",
  "Smart Cities & Infrastructure",
  "Government Regulators",
];

export default function OTWhoShouldAttend() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
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
        <div
          className="attend-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
          }}
        >
          {/* LEFT - Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
                Who Should Attend
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(30px, 3.5vw, 44px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: "20px 0 0",
              }}
            >
              Built for the OT Frontline
            </h2>

            {/* Paragraph */}
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "#808080",
                marginTop: 24,
              }}
            >
              OT Security First is designed exclusively for professionals who
              secure industrial control systems, operational technology
              environments, and critical infrastructure. If you protect things
              that move, generate, or flow — this is your summit.
            </p>

            {/* CTA Button */}
            <div style={{ marginTop: 28 }}>
              <RegisterButton />
            </div>
          </motion.div>

          {/* RIGHT - Two lists */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              {/* Roles List */}
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: OT_CRIMSON,
                    marginBottom: 16,
                  }}
                >
                  Roles
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {roles.map((role, index) => (
                    <motion.li
                      key={role}
                      initial={{ opacity: 0, x: 10 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }
                      }
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-2"
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        color: "#909090",
                        marginBottom: 8,
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: OT_CRIMSON,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      {role}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Industries List */}
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: OT_CRIMSON,
                    marginBottom: 16,
                  }}
                >
                  Industries
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {industries.map((industry, index) => (
                    <motion.li
                      key={industry}
                      initial={{ opacity: 0, x: 10 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }
                      }
                      transition={{
                        duration: 0.4,
                        delay: 0.35 + index * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-2"
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        color: "#909090",
                        marginBottom: 8,
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: OT_CRIMSON,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      {industry}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .attend-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * RegisterButton — Angular CTA button
 */
function RegisterButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="#register"
      className="inline-flex items-center gap-2 transition-all"
      style={{
        padding: "14px 28px",
        borderRadius: 6,
        background: isHovered ? OT_FIREBRICK : OT_CRIMSON,
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: "var(--white)",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Register for Next Edition →
    </Link>
  );
}
