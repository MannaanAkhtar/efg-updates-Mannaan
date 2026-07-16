"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const topics = [
  { num: "01", title: "Digital Transformation & AI", desc: "Integrating AI, IoT, and automation into operations for next-generation productivity." },
  { num: "02", title: "Agentic AI & Automation", desc: "Autonomous AI agents executing complex business processes." },
  { num: "03", title: "Process Excellence & Optimization", desc: "Lean, Six Sigma, BPM, and continuous improvement methodologies." },
  { num: "04", title: "Supply Chain Resilience", desc: "Building agile, transparent, and disruption-proof supply chains." },
  { num: "05", title: "Sustainability & ESG", desc: "Embedding environmentally responsible practices into operations." },
  { num: "06", title: "Giga-Project Operations", desc: "Operational strategies for mega-projects — NEOM, Qiddiya, Masdar." },
  { num: "07", title: "Public-Private Synergies", desc: "Bridging government vision and private-sector execution." },
  { num: "08", title: "Workforce Transformation", desc: "Upskilling, culture change, and high-performance teams." },
  { num: "09", title: "Finance & Procurement Excellence", desc: "Streamlining financial processes and strategic procurement." },
  { num: "10", title: "Operational Agility", desc: "Organizations that adapt and thrive in volatile environments." },
];

const stats = [
  { value: "$27B", label: "Saudi digital-economy investment" },
  { value: "AED 300B", label: "UAE industrial GDP target by 2031" },
  { value: "$3.3T", label: "Regional investment pipeline" },
  { value: "19%", label: "Digital economy's target GDP share" },
];

const PLATE_IMG =
  "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1751.JPG";

export default function OpexKeyThemes() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "transparent",
        padding: "clamp(52px, 6vw, 88px) 0",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          position: "relative",
        }}
      >
        <div className="opex-kt-spread">
          {/* ── LEFT MASTHEAD RAIL ─────────────────────────────── */}
          <div className="opex-kt-rail">
            <motion.div
              {...rise(0)}
              style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 26 }}
            >
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: VIOLET_BRIGHT }}>№</span>
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
                The Coverage
              </span>
            </motion.div>

            <motion.div {...rise(0.06)} style={{ marginBottom: 20 }}>
              <span style={{ display: "block", width: 24, height: 1, background: VIOLET_BRIGHT, marginBottom: 14 }} />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "3.4px",
                  textTransform: "uppercase",
                  color: VIOLET_BRIGHT,
                }}
              >
                Key Themes
              </span>
            </motion.div>

            <motion.h2
              {...rise(0.12)}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(32px, 3.4vw, 52px)",
                letterSpacing: "-1.4px",
                lineHeight: 1.05,
                color: OFFWHITE,
                margin: "0 0 22px",
              }}
            >
              Ten Themes, One{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                Mandate.
              </span>
            </motion.h2>

            <motion.p
              {...rise(0.18)}
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "32ch",
                margin: 0,
              }}
            >
              The currents shaping operational excellence across the Gulf — from
              agentic AI and process intelligence to giga-project delivery, ESG,
              and workforce transformation.
            </motion.p>

            {/* Photo plate */}
            <motion.figure {...rise(0.26)} className="opex-kt-plate-fig" style={{ margin: "36px 0 0" }}>
              <div className="opex-kt-plate">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLATE_IMG}
                  alt="OPEX First — on the agenda"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.92) brightness(0.72) contrast(1.03)" }}
                />
                <span className="opex-kt-crop" style={{ top: 8, left: 8, borderTop: "1px solid rgba(159,103,255,0.4)", borderLeft: "1px solid rgba(159,103,255,0.4)" }} />
                <span className="opex-kt-crop" style={{ top: 8, right: 8, borderTop: "1px solid rgba(159,103,255,0.4)", borderRight: "1px solid rgba(159,103,255,0.4)" }} />
                <span className="opex-kt-crop" style={{ bottom: 8, left: 8, borderBottom: "1px solid rgba(159,103,255,0.4)", borderLeft: "1px solid rgba(159,103,255,0.4)" }} />
                <span className="opex-kt-crop" style={{ bottom: 8, right: 8, borderBottom: "1px solid rgba(159,103,255,0.4)", borderRight: "1px solid rgba(159,103,255,0.4)" }} />
              </div>
              <figcaption
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.44)",
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ width: 16, height: 1, background: "rgba(159,103,255,0.5)", flexShrink: 0 }} />
                On the agenda — OPEX First UAE, Abu Dhabi.
              </figcaption>
            </motion.figure>
          </div>

          {/* ── RIGHT CONTENTS INDEX ───────────────────────────── */}
          <div className="opex-kt-index">
            {topics.map((t, i) => (
              <motion.div
                key={t.num}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.05, ease: EASE }}
                className="opex-kt-row"
              >
                <span className="opex-kt-num" aria-hidden>{t.num}</span>
                <div className="opex-kt-rowbody">
                  <h3 className="opex-kt-title">{t.title}</h3>
                  <p className="opex-kt-desc">{t.desc}</p>
                </div>
                <span className="opex-kt-arrow" aria-hidden>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── MACRO-MARKET LEDGER BAND ─────────────────────────── */}
        <motion.div
          {...rise(0.3)}
          className="opex-kt-ledger-wrap"
          style={{ marginTop: "clamp(38px, 4.5vw, 60px)" }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "2.4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.34)",
              marginBottom: 16,
            }}
          >
            The Market, in Numbers
          </span>
          <div className="opex-kt-ledger" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {stats.map((s) => (
              <div key={s.label} className="opex-kt-ledger-cell">
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(28px, 3vw, 44px)",
                    letterSpacing: "-1px",
                    color: VIOLET_BRIGHT,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "rgba(255,255,255,0.44)",
                    marginTop: 10,
                    maxWidth: "22ch",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-kt-spread {
          display: grid;
          grid-template-columns: minmax(260px, 320px) 1fr;
          column-gap: clamp(40px, 5vw, 72px);
          align-items: start;
        }
        .opex-kt-rail {
          position: sticky;
          top: 120px;
          align-self: start;
          padding-right: clamp(28px, 3vw, 48px);
          border-right: 1px solid rgba(159, 103, 255, 0.14);
        }
        .opex-kt-plate {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }
        .opex-kt-crop {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
        }

        .opex-kt-index {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(28px, 3.5vw, 52px);
        }
        .opex-kt-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(14px, 1.8vw, 24px);
          padding: clamp(13px, 1.5vw, 18px) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .opex-kt-row:nth-child(1),
        .opex-kt-row:nth-child(2) {
          border-top: none;
          padding-top: 0;
        }
        .opex-kt-num {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(24px, 2.4vw, 34px);
          letter-spacing: -1px;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(159, 103, 255, 0.32);
          transition: -webkit-text-stroke-color 0.4s, color 0.4s;
        }
        .opex-kt-row:hover .opex-kt-num {
          color: rgba(159, 103, 255, 0.85);
          -webkit-text-stroke-color: transparent;
        }
        .opex-kt-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(17px, 1.5vw, 21px);
          letter-spacing: -0.3px;
          line-height: 1.2;
          color: ${OFFWHITE};
          margin: 0;
          transition: color 0.4s;
        }
        .opex-kt-row:hover .opex-kt-title {
          color: ${VIOLET_BRIGHT};
        }
        .opex-kt-desc {
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: clamp(13px, 1vw, 14.5px);
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.5);
          margin: 5px 0 0;
          max-width: 40ch;
        }
        .opex-kt-arrow {
          display: inline-flex;
          color: rgba(159, 103, 255, 0.5);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-kt-row:hover .opex-kt-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .opex-kt-ledger {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .opex-kt-ledger-cell {
          padding: clamp(22px, 2.4vw, 30px) clamp(20px, 2.4vw, 32px) 4px 0;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding-left: clamp(20px, 2.4vw, 32px);
        }
        .opex-kt-ledger-cell:first-child {
          border-left: none;
          padding-left: 0;
        }

        @media (max-width: 900px) {
          .opex-kt-spread {
            grid-template-columns: 1fr;
            row-gap: clamp(40px, 7vw, 56px);
          }
          .opex-kt-rail {
            position: static;
            top: auto;
            border-right: none;
            padding-right: 0;
          }
          .opex-kt-plate-fig {
            max-width: 460px;
          }
        }
        @media (max-width: 680px) {
          .opex-kt-index {
            grid-template-columns: 1fr;
          }
          .opex-kt-row:nth-child(2) {
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            padding-top: clamp(13px, 1.5vw, 18px);
          }
          .opex-kt-row:nth-child(1) {
            border-top: none;
          }
          .opex-kt-ledger {
            grid-template-columns: repeat(2, 1fr);
            row-gap: 4px;
          }
          .opex-kt-ledger-cell {
            padding: 18px 12px 18px 16px !important;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .opex-kt-ledger-cell:nth-child(-n + 2) {
            border-top: none;
          }
          .opex-kt-ledger-cell:nth-child(odd) {
            border-left: none;
            padding-left: 0 !important;
          }
        }
        @media (max-width: 480px) {
          .opex-kt-row {
            gap: 14px;
          }
          .opex-kt-arrow {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-kt-rail { position: static; }
        }
      `}</style>
    </section>
  );
}
