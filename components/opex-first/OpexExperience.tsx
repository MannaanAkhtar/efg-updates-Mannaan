"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/events";

const formats = [
  {
    num: "01",
    title: "Keynotes & Leadership Panels",
    desc: "Strategic sessions with government excellence leaders, COOs, and transformation heads from across the Gulf.",
    image: `${S3}/Opex%20First%20UAE/4N8A1702.JPG`,
    wide: true,
  },
  {
    num: "02",
    title: "Hands-On Workshops",
    desc: "Applied sessions: BPMN 2.0, Lean Six Sigma simulations, and AI-powered process-mining labs.",
    image: `${S3}/opex+KSA+few/DSC08456.jpg`,
    wide: false,
  },
  {
    num: "03",
    title: "OPEX Awards Ceremony",
    desc: "Celebrating excellence across categories — from Operational Excellence Leader to Business Transformation.",
    image: `${S3}/opex+KSA+few/DSC08533.jpg`,
    wide: false,
  },
  {
    num: "04",
    title: "Curated 1-on-1 Meetings",
    desc: "Pre-matched meetings between enterprise excellence leaders and technology providers — every one curated for relevance.",
    image: `${S3}/Opex%20First%20UAE/4N8A1848.JPG`,
    wide: true,
  },
  {
    num: "05",
    title: "Live Case Studies",
    desc: "Real implementations from Saudi and UAE organisations — what worked, what failed, and what they learned.",
    image: `${S3}/Opex%20First%20UAE/4N8A1751.JPG`,
    wide: true,
  },
  {
    num: "06",
    title: "Networking & Gala Dinner",
    desc: "Structured networking and an evening gala connecting the operational-excellence community.",
    image: `${S3}/opex+KSA+few/DSC08208.jpg`,
    wide: false,
  },
];

export default function OpexExperience() {
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
        {/* ── Editorial header ─────────────────────────────────── */}
        <div className="opex-exp-head">
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
                The Format
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
              The Experience
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
              More Than a{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                Conference.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-exp-dek"
          >
            Every element is engineered for one outcome — that the right people
            leave with the right connections, insights, and momentum.
          </motion.p>
        </div>

        <div className="opex-exp-rule" />

        {/* ── Photographic bento ───────────────────────────────── */}
        <div className="opex-exp-grid">
          {formats.map((f, i) => (
            <motion.div
              key={f.num}
              className={f.wide ? "opex-exp-cell opex-exp-wide" : "opex-exp-cell"}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: EASE }}
            >
              <ExperienceTile format={f} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .opex-exp-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-exp-dek {
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
        .opex-exp-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 clamp(30px, 3.8vw, 44px);
        }
        .opex-exp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 1.6vw, 20px);
        }
        .opex-exp-wide {
          grid-column: span 2;
        }
        .opex-exp-tile {
          position: relative;
          height: clamp(230px, 24vw, 300px);
          overflow: hidden;
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }
        .opex-exp-tile img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.4) brightness(0.46) contrast(1.05);
          transition: filter 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-exp-tile:hover img {
          filter: grayscale(0) brightness(0.72);
          transform: scale(1.05);
        }
        .opex-exp-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to top,
            rgba(7, 5, 26, 0.94) 0%,
            rgba(7, 5, 26, 0.58) 40%,
            rgba(7, 5, 26, 0.22) 74%,
            rgba(7, 5, 26, 0.34) 100%
          );
        }
        .opex-exp-crop {
          position: absolute;
          width: 13px;
          height: 13px;
          z-index: 3;
          pointer-events: none;
          transition: border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-exp-tile:hover .opex-exp-crop {
          border-color: rgba(159, 103, 255, 0.6) !important;
        }
        .opex-exp-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${VIOLET_BRIGHT}, transparent);
          opacity: 0;
          transition: opacity 0.4s;
          z-index: 3;
        }
        .opex-exp-tile:hover .opex-exp-accent {
          opacity: 0.55;
        }
        .opex-exp-body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: clamp(18px, 2vw, 26px);
        }
        .opex-exp-num {
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          color: ${VIOLET_BRIGHT};
        }
        .opex-exp-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(17px, 1.6vw, 21px);
          letter-spacing: -0.3px;
          line-height: 1.2;
          color: ${OFFWHITE};
          margin: 8px 0 0;
        }
        .opex-exp-desc {
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.62);
          margin: 8px 0 0;
          max-width: 52ch;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .opex-exp-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .opex-exp-wide {
            grid-column: span 2;
          }
          .opex-exp-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-exp-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
        }
        @media (max-width: 600px) {
          .opex-exp-grid {
            grid-template-columns: 1fr;
          }
          .opex-exp-wide {
            grid-column: span 1;
          }
          .opex-exp-tile {
            height: clamp(220px, 60vw, 280px);
          }
          .opex-exp-desc {
            -webkit-line-clamp: 3;
          }
        }
      `}</style>
    </section>
  );
}

function ExperienceTile({ format }: { format: (typeof formats)[0] }) {
  return (
    <div className="opex-exp-tile">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={format.image} alt={format.title} loading="lazy" decoding="async" />
      <div className="opex-exp-scrim" />
      <span className="opex-exp-accent" />

      <span className="opex-exp-crop" style={{ top: 9, left: 9, borderTop: "1px solid rgba(159,103,255,0.34)", borderLeft: "1px solid rgba(159,103,255,0.34)" }} />
      <span className="opex-exp-crop" style={{ top: 9, right: 9, borderTop: "1px solid rgba(159,103,255,0.34)", borderRight: "1px solid rgba(159,103,255,0.34)" }} />
      <span className="opex-exp-crop" style={{ bottom: 9, left: 9, borderBottom: "1px solid rgba(159,103,255,0.34)", borderLeft: "1px solid rgba(159,103,255,0.34)" }} />
      <span className="opex-exp-crop" style={{ bottom: 9, right: 9, borderBottom: "1px solid rgba(159,103,255,0.34)", borderRight: "1px solid rgba(159,103,255,0.34)" }} />

      <div className="opex-exp-body">
        <span className="opex-exp-num">{format.num}</span>
        <h4 className="opex-exp-title">{format.title}</h4>
        <p className="opex-exp-desc">{format.desc}</p>
      </div>
    </div>
  );
}
