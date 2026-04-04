"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ScanLines } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE } from "./constants";

const faqs = [
  {
    id: 1,
    question: "What is Digital First?",
    answer:
      "Digital First is a summit series by Events First Group designed for enterprise leaders driving AI transformation. It brings together Chief Data Officers, AI architects, government strategists, and solution providers for a full day of practitioner-led sessions, workshops, and curated meetings.",
  },
  {
    id: 2,
    question: "Who should attend?",
    answer:
      "The series is built for C-suite and senior leaders in data, AI, digital transformation, and technology across sectors like government, finance, energy, healthcare, and telecommunications. Think CDOs, CAIOs, CTOs, Heads of Data Science, and Directors of Digital Transformation.",
  },
  {
    id: 3,
    question: "When and where is the first edition?",
    answer:
      "Digital First launches June 10, 2026 in Kuwait City, Kuwait, with Abu Dhabi, Riyadh, and Doha editions scheduled for 2027.",
  },
  {
    id: 4,
    question: "How is this different from other AI conferences?",
    answer:
      "No vendor pitches. No recycled keynotes. Every session is designed for actionable outcomes, live case studies with real numbers, hands-on workshops, a startup pitch stage, and pre-scheduled 1-on-1 meetings. It's a working summit, not a trade show.",
  },
  {
    id: 5,
    question: "How can my organization sponsor or partner?",
    answer:
      "We offer Patronage, Knowledge Partner, and Supporting Partner tiers. Founding partners of the Kuwait debut receive priority positioning across all 2027 editions. Contact us through the Sponsors & Partners page for the partnership deck.",
  },
  {
    id: 6,
    question: "Is there a registration fee?",
    answer:
      "Registration details and pricing for the Kuwait edition will be announced soon. Register your interest now to be first notified when full registration opens, and to receive early-bird access.",
  },
];

export default function DAFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeId, setActiveId] = useState(1);

  const activeItem = faqs.find((f) => f.id === activeId) || faqs[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0A0A0A",
        padding: "clamp(36px, 5vw, 56px) 0",
      }}
    >
      {/* Scan-line texture */}
      <ScanLines opacity={0.02} lineHeight={3} />

      {/* Emerald glow, bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 50% at 15% 80%, ${EMERALD}0A 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
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
              FAQ
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
            Common Questions
          </h2>
        </motion.div>

        {/* Console Layout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="da-faq-console"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 0,
            borderRadius: 18,
            overflow: "hidden",
            background: "rgba(15, 115, 94, 0.03)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${EMERALD}15`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.2), 0 0 80px ${EMERALD}05`,
          }}
        >
          {/* Question tabs */}
          <div
            style={{
              borderRight: `1px solid ${EMERALD}10`,
              background: "rgba(10,10,10,0.3)",
            }}
          >
            {/* Console header */}
            <div
              className="flex items-center gap-2"
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${EMERALD}08`,
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${EMERALD}40` }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${EMERALD}25` }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${EMERALD}15` }} />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#555555",
                  marginLeft: 8,
                  letterSpacing: "1px",
                }}
              >
                QUESTIONS
              </span>
            </div>

            {faqs.map((faq) => (
              <QuestionTab
                key={faq.id}
                faq={faq}
                isActive={faq.id === activeId}
                onClick={() => setActiveId(faq.id)}
              />
            ))}
          </div>

          {/* Answer panel */}
          <div
            style={{
              padding: "40px 36px",
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {/* Glow behind answer */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 300,
                height: 300,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${EMERALD}06 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ position: "relative" }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--white)",
                    margin: "0 0 16px",
                  }}
                >
                  {activeItem.question}
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 300,
                    color: "#808080",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {activeItem.answer}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: EMERALD,
              textDecoration: "none",
              letterSpacing: "0.5px",
            }}
          >
            Still have questions? Get in Touch →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .da-faq-console {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function QuestionTab({
  faq,
  isActive,
  onClick,
}: {
  faq: { id: number; question: string };
  isActive: boolean;
  onClick: () => void;
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
        padding: "18px 20px",
        background: isActive
          ? `${EMERALD}0A`
          : isHovered
            ? `${EMERALD}05`
            : "transparent",
        border: "none",
        borderBottom: `1px solid ${EMERALD}08`,
        borderLeft: isActive
          ? `3px solid ${EMERALD_BRIGHT}`
          : "3px solid transparent",
        cursor: "pointer",
        transitionDuration: "0.25s",
        position: "relative",
      }}
    >
      {/* Active glow indicator */}
      {isActive && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: 100,
            height: 40,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            background: `radial-gradient(ellipse at left center, ${EMERALD}12 0%, transparent 70%)`,
          }}
        />
      )}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 12,
          fontWeight: 700,
          color: isActive ? EMERALD_BRIGHT : `${EMERALD}40`,
          minWidth: 24,
          position: "relative",
        }}
      >
        {faq.id.toString().padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          fontWeight: isActive ? 500 : 400,
          color: isActive ? "var(--white)" : isHovered ? "#909090" : "#606060",
          transition: "color 0.2s",
          position: "relative",
        }}
      >
        {faq.question}
      </span>
    </button>
  );
}
