"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const GOLD = "#E4C580";
const GOLD_DEEP = "#C9A24B";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const TROPHY =
  "M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3";

const awards = [
  { num: "01", title: "Operational Excellence Leader", desc: "Outstanding achievement in implementing operational-excellence programmes across the organisation.", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { num: "02", title: "Business Transformation Leader", desc: "Successful execution of transformative initiatives for breakthrough performance.", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { num: "03", title: "Sustainability & ESG Excellence", desc: "Integration of environmentally responsible practices with measurable outcomes.", icon: "M12 22c5.5-3.5 10-7.5 10-12A10 10 0 002 10c0 4.5 4.5 8.5 10 12z" },
  { num: "04", title: "Innovation in Process Optimization", desc: "Pioneering new methods, tools, or technologies to optimise core processes.", icon: "M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" },
  { num: "05", title: "Finance & Procurement Excellence", desc: "Streamlining financial processes for cost savings, compliance, and efficiency.", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { num: "06", title: "Customer Experience Transformation", desc: "Exceptional improvement in customer-facing operations and service delivery.", icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" },
  { num: "07", title: "Intelligent Automation Leader", desc: "Leading adoption of AI, RPA, and intelligent automation across operations.", icon: "M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zM4.93 4.93a2 2 0 012.83 0l1.41 1.41A2 2 0 017.76 9.17L6.34 7.76a2 2 0 010-2.83zM12 18a2 2 0 012 2v2a2 2 0 01-4 0v-2a2 2 0 012-2zM2 12a2 2 0 012-2a2 2 0 010 4a2 2 0 01-2-2zM20 12a2 2 0 012-2a2 2 0 010 4a2 2 0 01-2-2z" },
  { num: "08", title: "Agentic AI & Transformation", desc: "Pioneering autonomous AI agents in business-process execution and decision-making.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
];

const grand = awards[0];
const rest = awards.slice(1);

const stats = [
  { value: "8", label: "Award Categories" },
  { value: "100+", label: "Nominations" },
  { value: "3", label: "Annual Editions" },
];

export default function OpexAwards() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "transparent",
        padding: "clamp(56px, 6.5vw, 96px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* faint gold halo behind the grand award */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 42% 34% at 50% 34%, rgba(228,197,128,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          position: "relative",
        }}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="opex-aw-head">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 20 }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: GOLD }}>№</span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.34)",
                }}
              >
                The Honours
              </span>
            </div>
            <span style={{ display: "block", width: 24, height: 1, background: GOLD, marginBottom: 14 }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "3.4px",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              OPEX Awards
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(32px, 3.6vw, 54px)",
                letterSpacing: "-1.4px",
                lineHeight: 1.04,
                color: OFFWHITE,
                margin: "16px 0 0",
              }}
            >
              Recognizing{" "}
              <span
                className="opex-aw-gold-shimmer"
                style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}
              >
                Excellence.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-aw-dek"
          >
            Eight categories celebrating operational excellence, innovation, and
            leadership across the series.
          </motion.p>
        </div>

        <div className="opex-aw-rule" />

        {/* ── Grand Award feature ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="opex-aw-grand"
        >
          <div className="opex-aw-grand-inner">
            <span className="opex-aw-grand-sheen" aria-hidden />
            <span className="opex-aw-grand-ghost" aria-hidden>{grand.num}</span>
            <div className="opex-aw-grand-row">
              <span className="opex-aw-emblem" aria-hidden>
                <span className="opex-aw-emblem-ring" />
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={TROPHY} />
                </svg>
              </span>
              <div className="opex-aw-grand-body">
                <span className="opex-aw-grand-tag">
                  <span className="opex-aw-grand-star">★</span>
                  Grand Award · Category 01
                </span>
                <h3 className="opex-aw-grand-title">{grand.title}</h3>
                <p className="opex-aw-grand-desc">{grand.desc}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Category grid (7 + CTA) ──────────────────────────── */}
        <div className="opex-aw-grid">
          {rest.map((a, i) => (
            <motion.div
              key={a.num}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: EASE }}
              className="opex-aw-card"
            >
              <span className="opex-aw-ghost" aria-hidden>{a.num}</span>
              <span className="opex-aw-icon" aria-hidden>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={a.icon} />
                </svg>
              </span>
              <span className="opex-aw-cat">Category {a.num}</span>
              <h4 className="opex-aw-title">{a.title}</h4>
              <p className="opex-aw-desc">{a.desc}</p>
              <span className="opex-aw-accent" aria-hidden />
            </motion.div>
          ))}

          {/* CTA card fills the 8th cell */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.5, delay: 0.3 + rest.length * 0.05, ease: EASE }}
          >
            <Link href="#register" className="opex-aw-cta-card">
              <span className="opex-aw-cta-emblem" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={TROPHY} />
                </svg>
              </span>
              <span className="opex-aw-cta-title">Nominations Open</span>
              <span className="opex-aw-cta-sub">
                Enter the next edition
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ── Stat ledger ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="opex-aw-ledger-wrap"
        >
          <span className="opex-aw-ledger-label">The Awards, in Numbers</span>
          <div className="opex-aw-ledger">
            {stats.map((s) => (
              <div key={s.label} className="opex-aw-ledger-cell">
                <div className="opex-aw-ledger-value">{s.value}</div>
                <div className="opex-aw-ledger-cap">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-aw-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-aw-gold-shimmer {
          background: linear-gradient(110deg, ${GOLD_DEEP} 0%, ${GOLD} 38%, #fff6df 50%, ${GOLD} 62%, ${GOLD_DEEP} 100%);
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: opexGoldShimmer 5s ease-in-out infinite;
        }
        @keyframes opexGoldShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .opex-aw-dek {
          font-family: ${SERIF};
          font-style: italic;
          font-weight: 400;
          font-size: clamp(14px, 1.15vw, 16.5px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          max-width: 34ch;
          margin: 0;
          padding-bottom: 6px;
        }
        .opex-aw-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 clamp(24px, 3vw, 36px);
        }

        /* Grand Award */
        .opex-aw-grand {
          padding: 1px;
          border-radius: 6px;
          background: linear-gradient(
            135deg,
            rgba(228, 197, 128, 0.55) 0%,
            rgba(124, 58, 237, 0.4) 42%,
            rgba(228, 197, 128, 0.28) 100%
          );
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 70px rgba(124, 58, 237, 0.12),
            0 0 40px rgba(228, 197, 128, 0.06);
          margin-bottom: clamp(14px, 1.6vw, 20px);
        }
        .opex-aw-grand-inner {
          position: relative;
          overflow: hidden;
          border-radius: 5px;
          background: linear-gradient(150deg, #150f2c 0%, #0b0820 60%, #120d26 100%);
          padding: clamp(30px, 3.4vw, 52px);
        }
        .opex-aw-grand-sheen {
          position: absolute;
          top: 0;
          left: 6%;
          right: 6%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(228, 197, 128, 0.7), rgba(159, 103, 255, 0.5), transparent);
        }
        .opex-aw-grand-ghost {
          position: absolute;
          top: 50%;
          right: clamp(20px, 3vw, 48px);
          transform: translateY(-50%);
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(140px, 17vw, 240px);
          line-height: 1;
          letter-spacing: -6px;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(228, 197, 128, 0.12);
          pointer-events: none;
          z-index: 0;
        }
        .opex-aw-grand-row {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: clamp(22px, 3vw, 44px);
        }
        .opex-aw-emblem {
          position: relative;
          flex-shrink: 0;
          width: clamp(72px, 8vw, 96px);
          height: clamp(72px, 8vw, 96px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 40% 35%, rgba(228, 197, 128, 0.16), rgba(124, 58, 237, 0.08));
          border: 1px solid rgba(228, 197, 128, 0.4);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 34px rgba(228, 197, 128, 0.14);
        }
        .opex-aw-emblem-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid rgba(228, 197, 128, 0.18);
        }
        .opex-aw-grand-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 13px;
          border-radius: 999px;
          background: rgba(228, 197, 128, 0.1);
          border: 1px solid rgba(228, 197, 128, 0.32);
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: ${GOLD};
          margin-bottom: 14px;
        }
        .opex-aw-grand-star {
          color: ${GOLD};
          font-size: 11px;
        }
        .opex-aw-grand-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(22px, 2.6vw, 34px);
          letter-spacing: -0.6px;
          line-height: 1.15;
          color: ${OFFWHITE};
          margin: 0 0 12px;
        }
        .opex-aw-grand-desc {
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: clamp(14px, 1.15vw, 16px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          max-width: 60ch;
        }

        /* Category grid */
        .opex-aw-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 1.4vw, 18px);
        }
        .opex-aw-card {
          position: relative;
          padding: clamp(22px, 2.2vw, 30px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.012);
          overflow: hidden;
          transition: border-color 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.45s ease;
        }
        .opex-aw-card:hover {
          border-color: rgba(228, 197, 128, 0.34);
          background: rgba(124, 58, 237, 0.05);
          transform: translateY(-4px);
        }
        .opex-aw-ghost {
          position: absolute;
          right: 8px;
          bottom: -14px;
          z-index: 0;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 96px;
          line-height: 1;
          letter-spacing: -3px;
          color: transparent;
          -webkit-text-stroke: 1px rgba(228, 197, 128, 0.1);
          transition: -webkit-text-stroke-color 0.45s ease;
          pointer-events: none;
        }
        .opex-aw-card:hover .opex-aw-ghost {
          -webkit-text-stroke-color: rgba(228, 197, 128, 0.22);
        }
        .opex-aw-icon {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(228, 197, 128, 0.2);
          background: rgba(228, 197, 128, 0.06);
          margin-bottom: 18px;
          transition: border-color 0.45s ease, box-shadow 0.45s ease;
        }
        .opex-aw-card:hover .opex-aw-icon {
          border-color: rgba(228, 197, 128, 0.42);
          box-shadow: 0 0 20px rgba(228, 197, 128, 0.14);
        }
        .opex-aw-cat {
          position: relative;
          z-index: 1;
          display: block;
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${GOLD};
          margin-bottom: 8px;
        }
        .opex-aw-title {
          position: relative;
          z-index: 1;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(16px, 1.35vw, 19px);
          letter-spacing: -0.3px;
          line-height: 1.25;
          color: ${OFFWHITE};
          margin: 0;
        }
        .opex-aw-desc {
          position: relative;
          z-index: 1;
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.5);
          margin: 10px 0 0;
        }
        .opex-aw-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        .opex-aw-card:hover .opex-aw-accent {
          opacity: 0.55;
        }

        /* CTA card */
        .opex-aw-cta-card {
          position: relative;
          height: 100%;
          min-height: 168px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: clamp(22px, 2.2vw, 30px);
          border-radius: 3px;
          text-decoration: none;
          border: 1px solid rgba(228, 197, 128, 0.22);
          background: linear-gradient(150deg, rgba(228, 197, 128, 0.07), rgba(124, 58, 237, 0.05));
          transition: border-color 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease;
        }
        .opex-aw-cta-card:hover {
          border-color: rgba(228, 197, 128, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(228, 197, 128, 0.08);
        }
        .opex-aw-cta-emblem {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(228, 197, 128, 0.34);
          background: rgba(228, 197, 128, 0.08);
          margin-bottom: 4px;
        }
        .opex-aw-cta-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(17px, 1.5vw, 20px);
          letter-spacing: -0.3px;
          color: ${OFFWHITE};
        }
        .opex-aw-cta-sub {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-outfit);
          font-size: 12.5px;
          font-weight: 500;
          color: ${GOLD};
        }
        .opex-aw-cta-sub svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-aw-cta-card:hover .opex-aw-cta-sub svg {
          transform: translateX(3px);
        }

        /* Ledger */
        .opex-aw-ledger-wrap {
          margin-top: clamp(40px, 5vw, 64px);
        }
        .opex-aw-ledger-label {
          display: block;
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.34);
          margin-bottom: 16px;
        }
        .opex-aw-ledger {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 640px;
        }
        .opex-aw-ledger-cell {
          padding: clamp(20px, 2.2vw, 28px) clamp(20px, 2.4vw, 32px) 4px 0;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding-left: clamp(20px, 2.4vw, 32px);
        }
        .opex-aw-ledger-cell:first-child {
          border-left: none;
          padding-left: 0;
        }
        .opex-aw-ledger-value {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(28px, 3vw, 42px);
          letter-spacing: -1px;
          color: ${GOLD};
          line-height: 1;
        }
        .opex-aw-ledger-cap {
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.44);
          margin-top: 10px;
        }

        @media (max-width: 1024px) {
          .opex-aw-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 760px) {
          .opex-aw-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-aw-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
          .opex-aw-grand-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }
          .opex-aw-grand-ghost {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .opex-aw-grid {
            grid-template-columns: 1fr;
          }
          .opex-aw-ledger {
            max-width: none;
          }
          .opex-aw-ledger-cell {
            padding: 16px 10px 16px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
