"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const EASE = [0.16, 1, 0.3, 1] as const;

const roles = [
  "Chief Operating Officer",
  "VP/Director Operations",
  "Head of Business Excellence",
  "Head of Transformation",
  "Head of Process Improvement",
  "Head of Supply Chain",
  "Head of Procurement",
  "Director of Sustainability",
  "Head of Digital Transformation",
  "Quality & Compliance Director",
];

const industries = [
  "Government & Public Sector",
  "Energy & Utilities",
  "Manufacturing",
  "Construction & Mega-Projects",
  "Banking & Financial Services",
  "Healthcare",
  "Tourism & Hospitality",
  "Retail & E-Commerce",
  "Transportation & Logistics",
  "Education",
];

export default function OpexWhoShouldAttend() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black-light)",
        padding: "clamp(36px, 4vw, 56px) 0",
      }}
    >
      <div
        className="opex-audience-grid"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "start",
        }}
      >
        {/* Left — Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Section Label */}
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 20, height: 2, background: VIOLET }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: VIOLET,
              }}
            >
              Who Should Attend
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 800,
              color: "var(--white)",
              letterSpacing: "-1px",
              margin: "0 0 16px",
              lineHeight: 1.15,
            }}
          >
            Built for Excellence Leaders
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 16,
              fontWeight: 300,
              color: "#808080",
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            Opex First is designed for the people responsible for making
            organizations work better — from process improvement to digital
            transformation to supply chain optimization.
          </p>

          {/* Image */}
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://opexfirst.com/wp-content/uploads/2025/10/DSC08142.jpg"
              alt="Opex First Audience"
              style={{
                width: "100%",
                height: 280,
                objectFit: "cover",
                borderRadius: 16,
              }}
            />
            <RegisterButton />
          </div>
        </motion.div>

        {/* Right — Roles & Industries */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          <div
            className="opex-audience-lists"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
            }}
          >
            {/* Roles */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: VIOLET,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Roles
              </span>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
                {roles.map((role, index) => (
                  <motion.li
                    key={role}
                    initial={{ opacity: 0, x: -8 }}
                    animate={
                      isInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -8 }
                    }
                    transition={{
                      duration: 0.3,
                      delay: 0.3 + index * 0.03,
                      ease: EASE,
                    }}
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      color: "#909090",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: VIOLET,
                        opacity: 0.5,
                        flexShrink: 0,
                      }}
                    />
                    {role}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: VIOLET,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Industries
              </span>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
                {industries.map((ind, index) => (
                  <motion.li
                    key={ind}
                    initial={{ opacity: 0, x: -8 }}
                    animate={
                      isInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -8 }
                    }
                    transition={{
                      duration: 0.3,
                      delay: 0.3 + index * 0.03,
                      ease: EASE,
                    }}
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      color: "#909090",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: VIOLET,
                        opacity: 0.5,
                        flexShrink: 0,
                      }}
                    />
                    {ind}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .opex-audience-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .opex-audience-lists {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function RegisterButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="#register"
      className="transition-all duration-300"
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        padding: "14px 0",
        borderRadius: 50,
        background: isHovered ? VIOLET_BRIGHT : VIOLET,
        textAlign: "center",
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--white)",
        display: "block",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Register for Next Edition →
    </Link>
  );
}
