"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const OT_FIREBRICK = "#E86BB8";
const EASE = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "What is OT Security First?",
    a: "OT Security First is the region\u2019s only dedicated critical infrastructure cybersecurity summit. We bring together OT security leaders, industrial cybersecurity experts, and critical infrastructure defenders from across the GCC to share knowledge, strategies, and real-world solutions for protecting operational technology environments.",
  },
  {
    q: "Who should attend?",
    a: "CISOs, OT Security Managers, ICS/SCADA Engineers, Industrial Cybersecurity Architects, Plant Security Officers, and VP/Director-level technology leaders from energy, oil & gas, utilities, manufacturing, and transportation sectors.",
  },
  {
    q: "How is this different from Cyber First?",
    a: "While Cyber First covers enterprise IT cybersecurity broadly, OT Security First focuses exclusively on operational technology \u2014 the systems that control physical processes in critical infrastructure. Different threat landscape, different defense strategies, different community.",
  },
  {
    q: "Where are the upcoming editions?",
    a: "The first edition took place in Abu Dhabi (Feb 2026). We're expanding to Riyadh, Kuwait City, and Doha — dates to be announced. Subscribe to our mailing list for early access and priority registration.",
  },
  {
    q: "How can my company sponsor?",
    a: "We offer Patronage, Knowledge Partner, Supporting Partner, and Community Partner tiers. Each includes tailored benefits from keynote slots and exhibition space to brand visibility and delegate access. Contact our partnerships team for the full sponsorship deck.",
  },
  {
    q: "What does the event format look like?",
    a: "A full-day summit featuring keynote addresses, panel discussions, CISO roundtables, technical demonstrations, an OT security exhibition, and structured networking sessions. Expect 30+ speakers, 150+ senior leaders, and meaningful connections with your OT security peers.",
  },
];

export default function OTFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0a0a0a",
        padding: "clamp(48px, 6vw, 80px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 40 }}
        >
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: OT_FIREBRICK,
              }}
            >
              FAQ
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "-1px",
              color: "var(--white)",
              lineHeight: 1.15,
              margin: "16px 0 0",
            }}
          >
            Common Questions
          </h2>
        </motion.div>

        {/* Console Layout: Questions (left) + Answer (right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="ot-faq-console"
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: 0,
            background: "#111111",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 10,
            overflow: "hidden",
            minHeight: 380,
          }}
        >
          {/* Left — Question Tabs */}
          <div
            style={{
              borderRight: "1px solid rgba(255, 255, 255, 0.05)",
              padding: "8px 0",
            }}
          >
            {faqs.map((faq, index) => (
              <QuestionTab
                key={index}
                question={faq.q}
                isActive={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                index={index}
              />
            ))}
          </div>

          {/* Right — Answer Panel */}
          <div
            style={{
              padding: "clamp(24px, 3vw, 40px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 700,
                    color: "var(--white)",
                    marginBottom: 16,
                    lineHeight: 1.3,
                  }}
                >
                  {faqs[activeIndex].q}
                </p>
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
                  {faqs[activeIndex].a}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .ot-faq-console {
            grid-template-columns: 1fr !important;
          }
          .ot-faq-console > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            max-height: 240px;
            overflow-y: auto;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * QuestionTab — Individual question selector with left-edge indicator
 */
function QuestionTab({
  question,
  isActive,
  onClick,
  index,
}: {
  question: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full text-left transition-all"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 20px",
        background: isActive
          ? `${OT_CRIMSON}08`
          : isHovered
            ? "rgba(255,255,255,0.02)"
            : "transparent",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transitionDuration: "0.25s",
      }}
    >
      {/* Left edge bar */}
      <div
        className="absolute left-0 top-2 bottom-2 transition-all"
        style={{
          width: 3,
          background: OT_CRIMSON,
          borderRadius: 2,
          opacity: isActive ? 1 : 0,
          transitionDuration: "0.3s",
        }}
      />

      {/* Index number */}
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 600,
          color: isActive ? OT_CRIMSON : "#303030",
          letterSpacing: "1px",
          minWidth: 20,
          transition: "color 0.25s",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Question text */}
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: isActive ? 500 : 400,
          color: isActive ? "var(--white)" : "#606060",
          lineHeight: 1.4,
          transition: "color 0.25s",
        }}
      >
        {question}
      </span>
    </button>
  );
}
