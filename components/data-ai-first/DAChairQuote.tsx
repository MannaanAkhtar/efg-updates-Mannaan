"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EMERALD, EASE, NARROW } from "./constants";

export default function DAChairQuote() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        background: "#0A0A0A",
        padding: "80px 24px",
      }}
    >
      {/* Gradient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(15,115,94,0.04) 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: NARROW, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center" }}
        >
          {/* Placeholder photo circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${EMERALD}20, ${EMERALD}08)`,
              border: `2px solid ${EMERALD}30`,
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 800,
                color: `${EMERALD}50`,
              }}
            >
              ?
            </span>
          </div>

          {/* Left emerald border accent */}
          <div
            style={{
              display: "inline-block",
              paddingLeft: 24,
              borderLeft: `3px solid ${EMERALD}40`,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(22px, 3.5vw, 32px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#808080",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              The world isn&rsquo;t waiting for the AI revolution. It&rsquo;s funding it,
              building it, and shaping the rules. What&rsquo;s missing is a platform where
              the builders meet.
            </p>

            <div style={{ marginTop: 20 }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--white)",
                  margin: 0,
                }}
              >
                Advisory Chair
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  color: `${EMERALD}90`,
                  marginTop: 2,
                }}
              >
                To be announced
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
