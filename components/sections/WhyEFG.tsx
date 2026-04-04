"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";

const S3_BASE = "https://efg-final.s3.eu-north-1.amazonaws.com";
const GOOD = `${S3_BASE}/Good`;
const CFK = `${S3_BASE}/events/Cyber%20First%20Kuwait%202025/filemail_photos`;

const EASE = [0.16, 1, 0.3, 1] as const;

// Typographic reveal words
const headlineWords = [
  { text: "The region's", dim: false },
  { text: "leading", dim: false },
  { text: "technology", dim: false },
  { text: "summit", dim: false },
  { text: "organizer.", dim: false },
  { text: "We architect", dim: true },
  { text: "the moments", dim: true },
  { text: "where", dim: true },
  { text: "industries", dim: true },
  { text: "shift.", dim: true },
];

// Bento tile data
const features = [
  {
    id: "curated",
    title: "Curated Audiences",
    description:
      "Every attendee is a senior decision-maker, CISOs, CDOs, CTOs, and enterprise leaders. No fillers. Just the people who shape cybersecurity budgets, AI strategy, and digital transformation direction.",
  },
  {
    id: "actionable",
    title: "Actionable Intelligence",
    description:
      "Frameworks you implement on Monday, not buzzwords you forget by Friday. Every keynote, panel, and boardroom session vetted for real-world value in cybersecurity, OT security, and operational excellence.",
  },
  {
    id: "global",
    title: "Local Depth, Global Reach",
    description:
      "Deep roots in every market we serve, Kuwait, Qatar, Saudi Arabia, UAE, India, and Kenya. Local context meets international expertise across the Middle East, Africa, and Asia.",
  },
  {
    id: "community",
    title: "Year-Round Community",
    description:
      "The network you build at our technology summits stays active between events. 5,000+ senior technology leaders and 200+ speakers, relationships that compound over time.",
  },
];

const stats = [
  { value: 15000, suffix: "+", label: "Senior Delegates", hasComma: true },
  { value: 96, suffix: "%", label: "Return Rate", hasComma: false },
];

export default function WhyEFG() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        padding: "clamp(96px, 8vw, 140px) 0 clamp(64px, 6vw, 96px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 20% 40%, rgba(232,101,26,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 45% 50% at 80% 60%, rgba(124,58,237,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 60% 35% at 50% 95%, rgba(232,101,26,0.04) 0%, transparent 50%)
          `,
          filter: "blur(50px)",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          opacity: 0.025,
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── EYEBROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-3"
          style={{ marginBottom: 24 }}
        >
          <span style={{ width: 30, height: 1, background: "var(--orange)" }} />
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
        </motion.div>

        {/* ── TYPOGRAPHIC REVEAL ── */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4.5vw, 60px)",
            letterSpacing: "-2px",
            lineHeight: 1.12,
            maxWidth: 900,
            margin: "0 0 clamp(48px, 6vw, 72px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.25em",
          }}
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.06,
                ease: EASE,
              }}
              style={{
                color: word.dim ? "#E8651A" : "var(--white)",
                display: "inline-block",
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </h2>

        {/* ── ASYMMETRIC BENTO GRID ── */}
        <div className="why-bento">
          {/* Photo tile, tall left */}
          <motion.div
            className="why-bento-photo-tall"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy"
              src={`${GOOD}/4N8A0290.JPG`}
              alt="Packed auditorium at Events First Group cybersecurity summit in Kuwait"
              className="why-bento-img"
            />
            <div className="why-bento-photo-overlay" />
            <div className="why-bento-photo-caption">
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Cyber First Kuwait · 2025
              </span>
            </div>
          </motion.div>

          {/* Feature 1: Curated */}
          <BentoFeature feature={features[0]} index={0} isInView={isInView} />

          {/* Stat 1: 15,000+ */}
          <BentoStat stat={stats[0]} index={0} isInView={isInView} />

          {/* Feature 2: Actionable */}
          <BentoFeature feature={features[1]} index={1} isInView={isInView} />

          {/* Stat 2: 96% */}
          <BentoStat stat={stats[1]} index={1} isInView={isInView} />

          {/* Feature 3: Global */}
          <BentoFeature feature={features[2]} index={2} isInView={isInView} />

          {/* Feature 4: Community */}
          <BentoFeature feature={features[3]} index={3} isInView={isInView} />

          {/* Photo tile, bottom right */}
          <motion.div
            className="why-bento-photo-small"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy"
              src={`${CFK}/cyber21-04-160.jpg`}
              alt="CISO and enterprise leaders networking at Cyber First Kuwait summit"
              className="why-bento-img"
            />
            <div className="why-bento-photo-overlay" />
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        /* ═══════════════════════════════════════════════════════════════
           BENTO GRID
           ═══════════════════════════════════════════════════════════════ */

        .why-bento {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: clamp(10px, 1.2vw, 14px);
        }

        /* Photo tall: col 1, rows 1-2 */
        .why-bento-photo-tall {
          grid-column: 1;
          grid-row: 1 / 3;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          min-height: 340px;
        }

        /* Photo small: col 3, row 3 */
        .why-bento-photo-small {
          grid-column: 3;
          grid-row: 3;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          min-height: 160px;
        }

        .why-bento-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .why-bento-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 10, 10, 0.85) 0%,
            rgba(10, 10, 10, 0.2) 40%,
            rgba(10, 10, 10, 0.1) 100%
          );
          pointer-events: none;
        }

        .why-bento-photo-caption {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
        }

        /* Feature tiles */
        .why-bento-feature {
          position: relative;
          padding: clamp(18px, 2vw, 24px);
          background: rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .why-bento-feature:hover {
          border-color: rgba(232, 101, 26, 0.2);
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.04);
        }

        .why-bento-feature-number {
          position: absolute;
          top: -8px;
          right: 12px;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 88px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.03);
          pointer-events: none;
          user-select: none;
        }

        .why-bento-feature-accent {
          width: 24px;
          height: 2px;
          background: #E8651A;
          border-radius: 1px;
          margin-bottom: 14px;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .why-bento-feature:hover .why-bento-feature-accent {
          width: 40px;
        }

        /* Stat tiles */
        .why-bento-stat {
          position: relative;
          padding: clamp(18px, 2vw, 24px);
          background: rgba(232, 101, 26, 0.04);
          border: 1px solid rgba(232, 101, 26, 0.1);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow: hidden;
        }

        .why-bento-stat-glow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(
            circle,
            rgba(232, 101, 26, 0.08) 0%,
            transparent 60%
          );
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════════════════════ */

        @media (max-width: 1024px) {
          .why-bento {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }

          .why-bento-photo-tall {
            grid-column: 1 / 3;
            grid-row: auto;
            min-height: 240px;
          }

          .why-bento-photo-small {
            grid-column: auto;
            grid-row: auto;
            min-height: 180px;
          }
        }

        @media (max-width: 640px) {
          .why-bento {
            grid-template-columns: 1fr;
          }

          .why-bento-photo-tall {
            grid-column: 1;
            min-height: 200px;
          }

          .why-bento-photo-small {
            grid-column: 1;
            min-height: 160px;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// BENTO FEATURE TILE
// ═══════════════════════════════════════════════════════════════

function BentoFeature({
  feature,
  index,
  isInView,
}: {
  feature: (typeof features)[number];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="why-bento-feature"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.35 + index * 0.08, ease: EASE }}
    >
      <span className="why-bento-feature-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="why-bento-feature-accent" />
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(15px, 1.3vw, 18px)",
          fontWeight: 700,
          letterSpacing: "-0.3px",
          color: "var(--white)",
          margin: "0 0 8px",
          lineHeight: 1.25,
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: "clamp(12.5px, 1vw, 13.5px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BENTO STAT TILE
// ═══════════════════════════════════════════════════════════════

function BentoStat({
  stat,
  index,
  isInView,
}: {
  stat: (typeof stats)[number];
  index: number;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const controls = animate(0, stat.value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplay(Math.floor(v)),
        onComplete: () => {
          setDisplay(stat.value);
          setLanded(true);
        },
      });
      return () => controls.stop();
    }, 600 + index * 150);
    return () => clearTimeout(timer);
  }, [isInView, stat.value, index]);

  const formatted = stat.hasComma
    ? display.toLocaleString()
    : display.toString();

  return (
    <motion.div
      className="why-bento-stat"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: EASE }}
    >
      <div className="why-bento-stat-glow" />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "baseline",
          gap: 2,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(36px, 3.5vw, 52px)",
            letterSpacing: "-2px",
            color: "#fff",
            lineHeight: 1,
            transition: landed ? "text-shadow 0.4s ease" : "none",
            textShadow: landed
              ? "0 0 40px rgba(232,101,26,0.35)"
              : "none",
          }}
        >
          {formatted}
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 1.6 }}
          animate={landed ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(24px, 2.5vw, 36px)",
            color: "#E8651A",
            lineHeight: 1,
          }}
        >
          {stat.suffix}
        </motion.span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          margin: 0,
          position: "relative",
        }}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}
