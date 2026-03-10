"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";

const S3_BASE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good";
const BG_IMAGE = `${S3_BASE}/4N8A0290.JPG`;

const EASE = [0.16, 1, 0.3, 1] as const;

const metrics = [
  { value: 5000, suffix: "+", label: "Senior Delegates", hasComma: true },
  { value: 16,   suffix: "",  label: "Editions Delivered", hasComma: false },
  { value: 6,    suffix: "",  label: "Nations", hasComma: false },
  { value: 12,   suffix: "+",  label: "Cities Worldwide", hasComma: false },
  { value: 200,  suffix: "+", label: "Expert Speakers", hasComma: false },
  { value: 99,   suffix: "+", label: "Strategic Sponsors", hasComma: false },
];

const headlineWords = [
  { text: "The world's", dim: false },
  { text: "most senior", dim: false },
  { text: "technology leaders", dim: false },
  { text: "don't attend", dim: false },
  { text: "events.", dim: false },
  { text: "They", dim: true },
  { text: "build", dim: true },
  { text: "here.", dim: true },
];

export default function ImpactBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0A0A0A",
        padding: "clamp(96px, 8vw, 120px) 0 clamp(64px, 6vw, 96px)",
      }}
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.32) saturate(0.7)" }}
          loading="lazy"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.3) 100%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.1) 25%, rgba(10,10,10,0.1) 75%, rgba(10,10,10,0.92) 100%)",
      }} />

      {/* Orange ambient glow — bottom left */}
      <div className="absolute pointer-events-none" style={{
        bottom: "-10%", left: "-5%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,101,26,0.12) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      {/* Orange ambient glow — top right */}
      <div className="absolute pointer-events-none" style={{
        top: "-10%", right: "-5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,101,26,0.07) 0%, transparent 70%)",
        filter: "blur(50px)",
      }} />

      <div className="relative z-10" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-3"
          style={{ marginBottom: 28 }}
        >
          <span style={{ width: 30, height: 1, background: "var(--orange)" }} />
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "var(--orange)",
            fontFamily: "var(--font-outfit)",
          }}>
            By The Numbers
          </span>
        </motion.div>

        {/* Headline — word by word reveal */}
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 68px)", letterSpacing: "-2px",
          lineHeight: 1.08, maxWidth: 880,
          margin: "0 0 clamp(48px, 5vw, 72px)",
          display: "flex", flexWrap: "wrap", gap: "0 0.25em",
        }}>
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: EASE }}
              style={{ color: word.dim ? "rgba(255,255,255,0.25)" : "var(--white)", display: "inline-block" }}
            >
              {word.text}
            </motion.span>
          ))}
        </h2>

        {/* Stats grid */}
        <div className="impact-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "0",
        }}>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.1, ease: EASE }}
              style={{
                paddingRight: 32,
                borderRight: index < metrics.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                paddingLeft: index > 0 ? 32 : 0,
              }}
              className="impact-stat"
            >
              <StatNumber
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                hasComma={metric.hasComma}
                delay={500 + index * 100}
                isInView={isInView}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .impact-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 40px 0 !important;
          }
          .impact-stat {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            padding: 0 0 40px 0 !important;
          }
          .impact-stat:nth-child(4),
          .impact-stat:nth-child(5),
          .impact-stat:nth-child(6) {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
        }
        @media (max-width: 640px) {
          .impact-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px 0 !important;
          }
          .impact-stat {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.07) !important;
            padding: 0 0 32px 0 !important;
          }
          .impact-stat:nth-child(5),
          .impact-stat:nth-child(6) {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

function StatNumber({
  value, suffix, label, hasComma, delay, isInView,
}: {
  value: number; suffix: string; label: string;
  hasComma: boolean; delay: number; isInView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplay(Math.floor(v)),
        onComplete: () => {
          setDisplay(value);
          setLanded(true);
        },
      });
      return () => controls.stop();
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  const formatted = hasComma ? display.toLocaleString() : display.toString();

  return (
    <div>
      {/* Number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 12 }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(32px, 3.2vw, 52px)", letterSpacing: "-2px",
          color: "#fff", lineHeight: 1,
          transition: landed ? "text-shadow 0.4s ease" : "none",
          textShadow: landed ? "0 0 40px rgba(232,101,26,0.35)" : "none",
        }}>
          {formatted}
        </span>
        {suffix && (
          <motion.span
            initial={{ opacity: 0, scale: 1.6 }}
            animate={landed ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(22px, 2.2vw, 36px)",
              color: "var(--orange)", lineHeight: 1,
            }}
          >
            {suffix}
          </motion.span>
        )}
      </div>

      {/* Animated underline */}
      <motion.div
        initial={{ width: 0 }}
        animate={landed ? { width: 32 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ height: 2, background: "var(--orange)", borderRadius: 1, marginBottom: 10 }}
      />

      {/* Label */}
      <p style={{
        fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500,
        letterSpacing: "1.2px", textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)", margin: 0,
      }}>
        {label}
      </p>
    </div>
  );
}
