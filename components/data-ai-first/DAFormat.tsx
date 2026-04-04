"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ScanLines } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE, NARROW, WIDE } from "./constants";

const formats = [
  { num: "01", title: "Keynotes & Leadership Panels", desc: "Strategic sessions with CDOs, CTOs, and government AI leaders. No vendor pitches, pure practitioner insight.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { num: "02", title: "Workshops & Deep Dives", desc: "Hands-on sessions: model deployment, data pipelines, prompt engineering, AI governance. Bring your laptop.", icon: "M14.7 6.3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-10 10V17h3.7l10-10zM3 21h18" },
  { num: "03", title: "Data & AI Awards", desc: "Recognizing excellence in AI Transformation, Data Innovation, Ethics, Emerging Talent, and Public Sector Impact.", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { num: "04", title: "Startup Pitch Stage", desc: "The most promising AI-native companies pitch to investors, enterprise leaders, and government funds.", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { num: "05", title: "Live Case Studies", desc: "Real deployments, real numbers. Organizations share what worked, what failed, and what they'd do differently.", icon: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" },
  { num: "06", title: "Curated Meetings", desc: "Pre-scheduled 1-on-1 meetings between enterprise leaders and solution providers. Quality over quantity.", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
];

export default function DAFormat() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#0A0A0A",
        padding: "clamp(36px, 5vw, 56px) 24px",
      }}
    >
      {/* Photo backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.05) saturate(0.3)", zIndex: 0 }}
      />

      {/* Scan-line texture */}
      <ScanLines opacity={0.02} lineHeight={4} />

      {/* Emerald glow, bottom center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 85%, ${EMERALD}0A 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      {/* Intro */}
      <div style={{ maxWidth: NARROW, margin: "0 auto 48px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
          style={{ marginBottom: 16 }}
        >
          <span style={{ width: 30, height: 2, background: EMERALD }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: EMERALD,
            }}
          >
            Format
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 800,
            color: "var(--white)",
            margin: 0,
            letterSpacing: "-1px",
          }}
        >
          More Than a Conference
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 17,
            fontWeight: 300,
            color: "#808080",
            lineHeight: 1.7,
            marginTop: 16,
          }}
        >
          Every format is built for actionable outcomes, not passive listening.
        </motion.p>
      </div>

      {/* Cards */}
      <div
        className="da-format-grid"
        style={{
          maxWidth: WIDE,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {formats.map((f, i) => (
          <FormatCard key={f.title} format={f} delay={i * 0.08} isInView={isInView} index={i} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        style={{ textAlign: "center", marginTop: 36, position: "relative", zIndex: 1 }}
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
          Experience It All →
        </a>
      </motion.div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .da-format-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .da-format-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function FormatCard({
  format,
  delay,
  isInView,
  index,
}: {
  format: { num: string; title: string; desc: string; icon: string };
  delay: number;
  isInView: boolean;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const xOffset = index % 3 === 0 ? -15 : index % 3 === 2 ? 15 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: xOffset, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="transition-all"
      style={{
        position: "relative",
        background: isHovered
          ? "rgba(15, 115, 94, 0.07)"
          : "rgba(15, 115, 94, 0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: isHovered
          ? `1px solid ${EMERALD}40`
          : "1px solid rgba(15, 115, 94, 0.06)",
        borderRadius: 16,
        padding: "32px 28px",
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${EMERALD}12`
          : "none",
        transitionDuration: "0.4s",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow blur on hover */}
      <div
        className="absolute pointer-events-none transition-opacity"
        style={{
          width: 250,
          height: 250,
          bottom: -60,
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at center, ${EMERALD}12 0%, transparent 70%)`,
          filter: "blur(60px)",
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.4s",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 transition-all"
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${EMERALD_BRIGHT}, transparent)`,
          opacity: isHovered ? 0.6 : 0,
          transitionDuration: "0.4s",
        }}
      />

      {/* Icon circle */}
      <div
        className="transition-all"
        style={{
          position: "relative",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isHovered ? `${EMERALD}18` : `${EMERALD}08`,
          border: `1px solid ${isHovered ? `${EMERALD}40` : `${EMERALD}20`}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transitionDuration: "0.3s",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHovered ? EMERALD_BRIGHT : `${EMERALD}80`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.3s" }}
        >
          <path d={format.icon} />
        </svg>
      </div>

      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--white)",
          marginTop: 20,
          marginBottom: 10,
          position: "relative",
        }}
      >
        {format.title}
      </h4>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 14.5,
          fontWeight: 300,
          color: "#707070",
          lineHeight: 1.7,
          position: "relative",
        }}
      >
        {format.desc}
      </p>
    </motion.div>
  );
}
