"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const roles = [
  "Chief Operating Officer",
  "VP / Director of Operations",
  "Head of Business Excellence",
  "Head of Transformation",
  "Head of Process Improvement",
  "Head of Supply Chain",
  "Head of Procurement",
  "Director of Sustainability",
  "Head of Digital Transformation",
  "Quality & Compliance Director",
];

const industries = [
  "Government & Public Sector",
  "Energy & Utilities",
  "Manufacturing",
  "Construction & Mega-Projects",
  "Banking & Financial Services",
  "Healthcare",
  "Tourism & Hospitality",
  "Retail & E-Commerce",
  "Transportation & Logistics",
  "Education",
];

const BAND_IMG =
  "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few/DSC08585.jpg";

export default function OpexWhoShouldAttend() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "transparent",
        padding: "clamp(56px, 6.5vw, 96px) 0",
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
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="opex-wsa-head">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 20 }}>
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
                The Room
              </span>
            </div>
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
              Who Should Attend
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
              Built for Excellence{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                Leaders.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-wsa-dek"
          >
            Designed for the people responsible for making organisations work
            better — from process improvement to digital transformation to
            supply-chain optimisation.
          </motion.p>
        </div>

        {/* ── Cinematic room band ──────────────────────────────── */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
          className="opex-wsa-band"
        >
          <div className="opex-wsa-band-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BAND_IMG} alt="The OPEX First room" loading="lazy" decoding="async" />
            <div className="opex-wsa-band-scrim" />
            <span className="opex-wsa-crop" style={{ top: 10, left: 10, borderTop: "1px solid rgba(159,103,255,0.4)", borderLeft: "1px solid rgba(159,103,255,0.4)" }} />
            <span className="opex-wsa-crop" style={{ top: 10, right: 10, borderTop: "1px solid rgba(159,103,255,0.4)", borderRight: "1px solid rgba(159,103,255,0.4)" }} />
            <span className="opex-wsa-crop" style={{ bottom: 10, left: 10, borderBottom: "1px solid rgba(159,103,255,0.4)", borderLeft: "1px solid rgba(159,103,255,0.4)" }} />
            <span className="opex-wsa-crop" style={{ bottom: 10, right: 10, borderBottom: "1px solid rgba(159,103,255,0.4)", borderRight: "1px solid rgba(159,103,255,0.4)" }} />
            <figcaption className="opex-wsa-band-cap">
              <span />
              300+ operational-excellence leaders, one room.
            </figcaption>
          </div>
        </motion.figure>

        {/* ── Directory bands ──────────────────────────────────── */}
        <DirectoryBand label="Roles" items={roles} inView={inView} delay={0.24} />
        <DirectoryBand label="Industries" items={industries} inView={inView} delay={0.32} />

        {/* ── CTA ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
          className="opex-wsa-cta-wrap"
        >
          <Link href="#register" className="opex-wsa-cta">
            Register for the next edition
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-wsa-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-wsa-dek {
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

        .opex-wsa-band {
          margin: clamp(30px, 3.6vw, 46px) 0 clamp(34px, 4vw, 52px);
        }
        .opex-wsa-band-img {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 1;
          overflow: hidden;
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }
        .opex-wsa-band-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(0.3) brightness(0.6) contrast(1.04);
          transition: filter 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-wsa-band-img:hover img {
          filter: grayscale(0) brightness(0.78);
          transform: scale(1.03);
        }
        .opex-wsa-band-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(7, 5, 26, 0.66) 0%,
            transparent 42%
          ),
          linear-gradient(to top, rgba(7, 5, 26, 0.7) 0%, transparent 46%);
        }
        .opex-wsa-crop {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
          z-index: 2;
        }
        .opex-wsa-band-cap {
          position: absolute;
          left: clamp(16px, 2.4vw, 30px);
          bottom: clamp(14px, 2vw, 24px);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 11px;
          font-family: ${SERIF};
          font-style: italic;
          font-size: clamp(13px, 1.15vw, 16px);
          color: rgba(255, 255, 255, 0.82);
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.5);
        }
        .opex-wsa-band-cap span {
          width: clamp(20px, 3vw, 34px);
          height: 1px;
          background: rgba(159, 103, 255, 0.6);
          flex-shrink: 0;
        }

        .opex-wsa-dirband {
          margin-top: clamp(24px, 2.8vw, 34px);
        }
        .opex-wsa-dirband-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .opex-wsa-dirband-label {
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: ${VIOLET_BRIGHT};
          flex-shrink: 0;
        }
        .opex-wsa-dirband-count {
          font-family: ${SERIF};
          font-style: italic;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.34);
          flex-shrink: 0;
        }
        .opex-wsa-dirband-rule {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.09);
        }
        .opex-wsa-pills {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(8px, 0.9vw, 11px);
        }
        .opex-wsa-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
          font-family: var(--font-outfit);
          font-size: 13.5px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.72);
          transition: color 0.35s, border-color 0.35s, background 0.35s,
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-wsa-pill:hover {
          color: #fff;
          border-color: rgba(159, 103, 255, 0.5);
          background: rgba(124, 58, 237, 0.1);
          transform: translateY(-2px);
        }
        .opex-wsa-pill-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(159, 103, 255, 0.55);
          flex-shrink: 0;
          transition: background 0.35s, box-shadow 0.35s;
        }
        .opex-wsa-pill:hover .opex-wsa-pill-dot {
          background: ${VIOLET_BRIGHT};
          box-shadow: 0 0 7px ${VIOLET_BRIGHT};
        }

        .opex-wsa-cta-wrap {
          margin-top: clamp(36px, 4.5vw, 56px);
        }
        .opex-wsa-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 26px;
          border-radius: 999px;
          background: linear-gradient(135deg, ${VIOLET}, ${VIOLET_BRIGHT});
          text-decoration: none;
          font-family: var(--font-outfit);
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: #fff;
          box-shadow: 0 6px 22px rgba(124, 58, 237, 0.28);
          transition: box-shadow 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-wsa-cta:hover {
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.45);
          transform: translateY(-2px);
        }
        .opex-wsa-cta svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-wsa-cta:hover svg {
          transform: translateX(3px);
        }

        @media (max-width: 760px) {
          .opex-wsa-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-wsa-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
          .opex-wsa-band-img {
            aspect-ratio: 16 / 10;
          }
        }
        @media (max-width: 460px) {
          .opex-wsa-cta {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

function DirectoryBand({
  label,
  items,
  inView,
  delay,
}: {
  label: string;
  items: string[];
  inView: boolean;
  delay: number;
}) {
  return (
    <div className="opex-wsa-dirband">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay, ease: EASE }}
        className="opex-wsa-dirband-head"
      >
        <span className="opex-wsa-dirband-label">{label}</span>
        <span className="opex-wsa-dirband-count">{items.length}</span>
        <span className="opex-wsa-dirband-rule" />
      </motion.div>
      <div className="opex-wsa-pills">
        {items.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: delay + 0.05 + i * 0.03, ease: EASE }}
            className="opex-wsa-pill"
          >
            <span className="opex-wsa-pill-dot" />
            {item}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
