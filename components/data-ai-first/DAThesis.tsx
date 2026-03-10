"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EMERALD, EMERALD_BRIGHT, EASE, WIDE } from "./constants";

export default function DAThesis() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="content"
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#0A0A0A",
        padding: "clamp(36px, 5vw, 56px) 24px",
      }}
    >
      {/* Diagonal grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(15,115,94,0.04) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(15,115,94,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          zIndex: 1,
        }}
      />
      {/* Emerald glow — left center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 15% 40%, ${EMERALD}0C 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <div
        className="da-thesis-grid"
        style={{
          maxWidth: WIDE,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ─── LEFT: Text Content (60%) ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Label */}
          <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
            <div style={{ position: "relative", width: 10, height: 10 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: EMERALD_BRIGHT,
                  opacity: 0.75,
                  animation: "daPulse 2s ease-out infinite",
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: EMERALD_BRIGHT,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: EMERALD,
              }}
            >
              Why This Exists
            </span>
          </div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 3.5vw, 44px)",
              fontWeight: 800,
              color: "var(--white)",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              margin: "0 0 24px",
            }}
          >
            The World&rsquo;s Boldest
            <br />
            <span style={{ color: EMERALD_BRIGHT }}>AI Bets</span>
          </motion.h2>

          {/* Body text — tighter, one paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 17,
              fontWeight: 300,
              color: "#909090",
              lineHeight: 1.8,
              marginBottom: 0,
              maxWidth: 520,
            }}
          >
            Nations worldwide are making historic bets on artificial intelligence.
            Kuwait&rsquo;s Vision 2035 names AI as its primary economic diversifier.
            The UAE has the world&rsquo;s first Minister of AI.
            Saudi Arabia is building NEOM — an entire city run on data.
            The question is no longer <em>whether</em> AI will transform
            enterprise. It&rsquo;s <em>who</em> will lead that transformation.
          </motion.p>

          {/* Shimmer pull quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: 36,
              paddingLeft: 20,
              borderLeft: `3px solid ${EMERALD}50`,
              position: "relative",
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                width: 250,
                height: 150,
                top: "50%",
                left: 0,
                transform: "translate(-30%, -50%)",
                background: `radial-gradient(ellipse at center, ${EMERALD}08 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.5,
                margin: 0,
                position: "relative",
                backgroundImage: `linear-gradient(90deg, #808080, ${EMERALD_BRIGHT}, ${EMERALD}, #808080)`,
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "daShimmer 6s ease-in-out infinite alternate",
              }}
            >
              Between ambition and execution, there&rsquo;s a summit series.
            </p>
          </motion.div>

          {/* Info tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2"
            style={{ marginTop: 32 }}
          >
            {["Launching 2026", "Kuwait City", "Multiple Cities"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#686868",
                  padding: "6px 14px",
                  borderRadius: 50,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 28 }}
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
              Be Part of the First Edition →
            </a>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT: Photo (40%) ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.97 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <ThesisPhoto />
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes daShimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes daPulse {
          0% { transform: scale(1); opacity: 0.75; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @media (max-width: 900px) {
          .da-thesis-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────── PHOTO CARD ─────────────────────────── */

function ThesisPhoto() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative transition-all"
      style={{
        borderRadius: 20,
        overflow: "hidden",
        aspectRatio: "3 / 4",
        border: `1px solid ${isHovered ? `${EMERALD}30` : "rgba(255,255,255,0.06)"}`,
        boxShadow: isHovered
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 50px ${EMERALD}10`
          : "0 10px 40px rgba(0,0,0,0.3)",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
        alt="AI Summit event"
        className="absolute inset-0 w-full h-full object-cover transition-all"
        style={{
          filter: isHovered
            ? "brightness(0.45) saturate(0.8)"
            : "brightness(0.35) saturate(0.6)",
          transform: isHovered ? "scale(1.06)" : "scale(1)",
          transitionDuration: "0.7s",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Emerald tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          background: `linear-gradient(160deg, ${EMERALD}15 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0.5,
          transitionDuration: "0.5s",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 40%, transparent 100%)`,
        }}
      />

      {/* Ambient glow blur on hover */}
      <div
        className="absolute pointer-events-none transition-opacity"
        style={{
          width: 300,
          height: 300,
          bottom: -60,
          left: "30%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at center, ${EMERALD}18 0%, transparent 70%)`,
          filter: "blur(60px)",
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.5s",
        }}
      />

      {/* Bottom content overlay */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: "0 24px 28px" }}
      >
        {/* Accent line */}
        <div
          className="transition-all"
          style={{
            width: isHovered ? 40 : 24,
            height: 3,
            background: EMERALD_BRIGHT,
            borderRadius: 2,
            marginBottom: 12,
            boxShadow: isHovered ? `0 0 12px ${EMERALD}60` : "none",
            transitionDuration: "0.4s",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--white)",
            margin: "0 0 4px",
          }}
        >
          Data & AI First
        </p>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 400,
            color: "#707070",
            margin: 0,
          }}
        >
          A working summit for AI leaders
        </p>
      </div>
    </div>
  );
}
