"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

const outcomes = [
  { value: "92%", label: "Would Attend Again" },
  { value: "87%", label: "Director-Level & Above" },
  { value: "12", label: "Avg Meetings Per Attendee" },
  { value: "34", label: "Speakers from 6 Countries" },
];

export default function OTOutcomesStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#0a0a0a",
        borderTop: `1px solid ${OT_CRIMSON}25`,
        borderBottom: `1px solid ${OT_CRIMSON}25`,
        padding: "clamp(24px, 3vw, 36px) 0",
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
          className="ot-outcomes-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
        >
          {outcomes.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
              style={{
                textAlign: "center",
                padding: "8px 16px",
                borderRight:
                  index < outcomes.length - 1
                    ? `1px solid ${OT_CRIMSON}20`
                    : "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 2.5vw, 32px)",
                  fontWeight: 800,
                  color: OT_CRIMSON,
                  letterSpacing: "-1px",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#686868",
                  margin: "6px 0 0",
                  letterSpacing: "0.3px",
                }}
              >
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .ot-outcomes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .ot-outcomes-grid > div {
            border-right: none !important;
          }
        }
        @media (max-width: 480px) {
          .ot-outcomes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
