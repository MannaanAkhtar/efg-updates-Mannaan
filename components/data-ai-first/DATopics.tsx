"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { DotMatrixGrid } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE, WIDE } from "./constants";

const topics = [
  {
    num: "01",
    title: "Enterprise AI Strategy",
    desc: "Building AI-first organizations from boardroom buy-in to production deployment. Learn how leading enterprises are structuring AI governance, building internal capabilities, and creating roadmaps that move beyond pilots to full-scale transformation.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
  },
  {
    num: "02",
    title: "Generative AI at Scale",
    desc: "Enterprise LLM deployment, responsible GenAI, and measuring ROI on generative investments. From retrieval-augmented generation to fine-tuning domain-specific models, discover practical frameworks for scaling generative AI across the enterprise.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    num: "03",
    title: "Data Governance & Privacy",
    desc: "Regulatory frameworks, cross-border data flows, and sovereign data infrastructure. Navigate the evolving compliance landscape while building data architectures that enable innovation without compromising trust.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    num: "04",
    title: "AI for National Transformation",
    desc: "Government AI strategies driving economic diversification and smart city development. Explore how nations are leveraging AI as a pillar of national vision programs — from Kuwait's 2035 plan to Saudi Arabia's NEOM.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    num: "05",
    title: "The CDO Agenda",
    desc: "The evolution of the Chief Data Officer from data custodian to strategic business leader. Hear from sitting CDOs about building data cultures, measuring data maturity, and translating data assets into competitive advantage.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    num: "06",
    title: "AI in Financial Services",
    desc: "Algorithmic finance, fraud detection, credit intelligence, and compliant AI. Discover how banks and fintechs are deploying machine learning for real-time risk assessment, regulatory reporting, and customer intelligence.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    num: "07",
    title: "AI Ethics & Responsible AI",
    desc: "Bias mitigation, algorithmic auditing, transparency, and trustworthy AI systems. Understand the frameworks being adopted by regulators and enterprises to ensure AI systems are fair, explainable, and aligned with societal values.",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
  {
    num: "08",
    title: "AI Talent & Workforce",
    desc: "Closing the skills gap through university partnerships and talent development. Address the most critical bottleneck in AI adoption — people — with strategies for upskilling, reskilling, and attracting top AI talent.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    num: "09",
    title: "Predictive Analytics",
    desc: "From business intelligence dashboards to autonomous decision systems. Explore how organizations are moving beyond descriptive analytics to predictive and prescriptive models that drive real-time operational decisions.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    num: "10",
    title: "Women in Data & AI",
    desc: "Advancing diversity in data science, ML engineering, and AI leadership. Spotlight sessions featuring women leaders who are shaping the region's AI landscape, with actionable strategies for building inclusive data teams.",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
];

export default function DATopics() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeId, setActiveId] = useState("01");

  const activeTopic = topics.find((t) => t.num === activeId) || topics[0];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#0A0A0A",
        padding: "clamp(36px, 5vw, 56px) 0",
      }}
    >
      {/* Vertical line pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(15,115,94,0.035) 59px, rgba(15,115,94,0.035) 60px)`,
          zIndex: 1,
        }}
      />

      {/* Emerald glow — left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 50% at 10% 50%, ${EMERALD}0A 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <DotMatrixGrid color={EMERALD} opacity={0.015} spacing={32} />

      <div
        style={{
          maxWidth: WIDE + 100,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: EMERALD }} />
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
              What We Cover
            </span>
            <span style={{ width: 30, height: 1, background: EMERALD }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "20px 0 0",
            }}
          >
            10 Tracks. One Mission.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "14px auto 0",
            }}
          >
            From governance to generative AI, from national policy to production
            deployment.
          </p>
        </motion.div>

        {/* Console: Card Grid Left + Detail Panel Right */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="da-topics-console"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Left: Card Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              alignContent: "start",
            }}
          >
            {topics.map((topic, i) => (
              <TopicCard
                key={topic.num}
                topic={topic}
                isActive={topic.num === activeId}
                onClick={() => setActiveId(topic.num)}
                delay={i * 0.04}
                isInView={isInView}
              />
            ))}
          </div>

          {/* Right: Detail Panel */}
          <div
            style={{
              background: "rgba(15, 115, 94, 0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${EMERALD}15`,
              borderRadius: 18,
              padding: "36px 32px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 380,
            }}
          >
            {/* Background glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 350,
                height: 350,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${EMERALD}08 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            {/* Large faded number watermark */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`num-${activeTopic.num}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="absolute pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 180,
                  fontWeight: 900,
                  color: `${EMERALD}08`,
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  lineHeight: 1,
                }}
              >
                {activeTopic.num}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTopic.num}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ position: "relative" }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${EMERALD}15`,
                    border: `1px solid ${EMERALD}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={EMERALD_BRIGHT}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={activeTopic.icon} />
                  </svg>
                </div>

                {/* Track number */}
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: EMERALD_BRIGHT,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Track {activeTopic.num}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--white)",
                    margin: "10px 0 16px",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  {activeTopic.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 300,
                    color: "#909090",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {activeTopic.desc}
                </p>

                {/* Bottom accent */}
                <div
                  style={{
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${EMERALD_BRIGHT}, ${EMERALD}60)`,
                    borderRadius: 2,
                    marginTop: 24,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginTop: 36 }}
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
            Choose Your Track →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .da-topics-console {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Topic Card (Glassmorphism selector) ─── */

function TopicCard({
  topic,
  isActive,
  onClick,
  delay,
  isInView,
}: {
  topic: (typeof topics)[0];
  isActive: boolean;
  onClick: () => void;
  delay: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, delay: 0.3 + delay, ease: EASE }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full text-left transition-all"
      style={{
        position: "relative",
        padding: "16px 16px",
        borderRadius: 14,
        background: isActive
          ? `rgba(15, 115, 94, 0.08)`
          : isHovered
            ? `rgba(15, 115, 94, 0.04)`
            : "rgba(255, 255, 255, 0.015)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: isActive
          ? `1px solid ${EMERALD}40`
          : isHovered
            ? `1px solid ${EMERALD}20`
            : "1px solid rgba(255, 255, 255, 0.04)",
        cursor: "pointer",
        overflow: "hidden",
        transform: isActive
          ? "scale(1.02)"
          : isHovered
            ? "scale(1.01)"
            : "scale(1)",
        boxShadow: isActive
          ? `0 8px 32px rgba(0,0,0,0.2), 0 0 20px ${EMERALD}10`
          : "none",
        transitionDuration: "0.35s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Active left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 transition-all"
        style={{
          width: 3,
          borderRadius: "3px 0 0 3px",
          background: EMERALD_BRIGHT,
          opacity: isActive ? 1 : 0,
          transitionDuration: "0.3s",
        }}
      />

      {/* Active glow indicator */}
      {isActive && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: 80,
            height: 60,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            background: `radial-gradient(ellipse at left center, ${EMERALD}15 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Number */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          fontWeight: 700,
          color: isActive ? EMERALD_BRIGHT : `${EMERALD}40`,
          letterSpacing: "1px",
          position: "relative",
        }}
      >
        {topic.num}
      </span>

      {/* Title */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 14,
          fontWeight: 600,
          color: isActive ? "var(--white)" : isHovered ? "#c0c0c0" : "#808080",
          margin: "6px 0 0",
          lineHeight: 1.3,
          transition: "color 0.2s",
          position: "relative",
        }}
      >
        {topic.title}
      </p>
    </motion.button>
  );
}
