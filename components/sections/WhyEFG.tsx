"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    id: "curated",
    title: "Curated Audiences",
    description:
      "Every attendee is a senior decision-maker. No padding, no fillers — just the people who shape budgets, strategy, and direction at the world's largest enterprises.",
  },
  {
    id: "actionable",
    title: "Actionable Intelligence",
    description:
      "Sessions designed to deliver frameworks you implement on Monday, not buzzwords you forget by Friday. Every talk is vetted for practical, real-world value.",
  },
  {
    id: "global",
    title: "Local Depth, Global Reach",
    description:
      "Deep roots in every market we serve, with perspectives drawn from the world's leading technology practitioners. Local context meets international expertise.",
  },
  {
    id: "community",
    title: "Year-Round Community",
    description:
      "Our events are milestones in an ongoing conversation. The network you build here stays active between conferences — relationships that compound over time.",
  },
];

export default function WhyEFG() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(96px, 8vw, 120px) 0 clamp(40px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 50%, rgba(232,101,26,0.03) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 30%, rgba(232,101,26,0.02) 0%, transparent 60%)
          `,
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ maxWidth: 640, marginBottom: "clamp(32px, 4vw, 44px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  width: 30,
                  height: 1,
                  background: "var(--orange)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#E8651A",
                  fontFamily: "var(--font-outfit)",
                }}
              >
                Why Events First Group
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-2px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "14px 0 0",
            }}
          >
            Engineered
            <br />
            for <span style={{ color: "#E8651A" }}>Impact</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(15px, 1.3vw, 17px)",
              color: "#707070",
              lineHeight: 1.75,
              margin: "16px 0 0",
              maxWidth: 520,
            }}
          >
            We don't organize events. We architect moments where decisions
            are made, partnerships are formed, and industries shift direction.
          </motion.p>
        </div>

        {/* ── 2×2 GRID ── */}
        <div
          className="why-efg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(8px, 1.5vw, 12px) clamp(24px, 4vw, 48px)",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{
                duration: 0.6,
                delay: 0.25 + index * 0.08,
                ease: EASE,
              }}
            >
              <div style={{ padding: "clamp(14px, 2vw, 20px) 0" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(16px, 1.4vw, 19px)",
                    fontWeight: 700,
                    letterSpacing: "-0.3px",
                    color: "var(--white)",
                    margin: "0 0 8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(13px, 1.1vw, 14.5px)",
                    fontWeight: 300,
                    color: "#606060",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 700px) {
          .why-efg-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
