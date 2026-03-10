"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const EASE = [0.16, 1, 0.3, 1] as const;

export default function OpexAboutSeries() {
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
        className="opex-about-grid"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* Left — Content */}
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
              About Opex First
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 800,
              color: "var(--white)",
              letterSpacing: "-1px",
              margin: "0 0 24px",
              lineHeight: 1.15,
            }}
          >
            Redefining Operational Brilliance
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 17,
              fontWeight: 300,
              color: "#808080",
              lineHeight: 1.8,
              marginBottom: 20,
            }}
          >
            The world is in the middle of unprecedented economic transformation.
            Saudi Arabia&apos;s Vision 2030, the UAE&apos;s Operation 300bn,
            Kuwait&apos;s New Kuwait 2035 — trillions of dollars in mega-projects,
            industrial diversification, and digital transformation. But vision
            without execution is just a plan. Opex First is where execution gets
            engineered.
          </p>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 17,
              fontWeight: 300,
              color: "#808080",
              lineHeight: 1.8,
            }}
          >
            This is the region&apos;s only dedicated platform for operational
            excellence — uniting government authorities, business leaders, and
            global technology innovators to share strategies, address evolving
            challenges, and set new benchmarks for efficiency, sustainability, and
            performance.
          </p>
        </motion.div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          style={{ borderRadius: 20, overflow: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://opexfirst.com/wp-content/uploads/2025/07/about-bg1.jpg"
            alt="Opex First Summit"
            style={{
              width: "100%",
              height: "100%",
              minHeight: 400,
              objectFit: "cover",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(124,58,237,0.08)",
            }}
          />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .opex-about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
