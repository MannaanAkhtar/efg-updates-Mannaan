"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScanLines } from "@/components/effects";
import { EMERALD, EASE } from "./constants";

const outcomes = [
  { value: "200+", label: "Expected Attendees" },
  { value: "30+", label: "Expert Speakers" },
  { value: "4+", label: "Global Cities" },
  { value: "1", label: "Day of Intelligence" },
];

export default function DAOutcomesStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: `rgba(15,115,94,0.015)`,
        borderTop: `1px solid ${EMERALD}10`,
        borderBottom: `1px solid ${EMERALD}10`,
        padding: "32px 24px",
      }}
    >
      {/* Subtle scan lines for data feel */}
      <ScanLines opacity={0.01} lineHeight={3} />

      <div
        className="da-outcomes-grid"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {outcomes.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 800,
                color: EMERALD,
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
                marginTop: 6,
                letterSpacing: "0.5px",
              }}
            >
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        @media (max-width: 600px) {
          .da-outcomes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
