"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;

const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

// Real series colophon — verified figures across the OPEX First editions.
const COLOPHON = [
  { value: "03", label: "Editions" },
  { value: "02", label: "Nations" },
  { value: "300+", label: "Leaders Engaged" },
  { value: "30+", label: "Industry Speakers" },
];

// Real market intelligence, distilled from the OPEX First Saudi 2026 brief.
const FIELD_NOTES = [
  {
    num: "01",
    kicker: "Drivers",
    line: "Vision 2030 has shifted from blueprint to delivery — every leadership conversation now opens with measurable outcomes.",
  },
  {
    num: "02",
    kicker: "Signals",
    line: "Mandates are landing as deployments: 1,000+ KPI-bound initiatives, SDAIA's national AI, and Aramco-scale real-time optimisation.",
  },
  {
    num: "03",
    kicker: "Opportunities",
    line: "The execution decade rewards platforms that govern outcomes — not just enable them.",
  },
];

const PLATE_IMG =
  "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1848.JPG";

export default function OpexAboutSeries() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "transparent",
        padding: "clamp(72px, 9vw, 128px) 0",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(22px, 5vw, 80px)",
          position: "relative",
        }}
      >
        <div className="opex-about-spread">
          {/* ── LEFT MASTHEAD RAIL ─────────────────────────────── */}
          <div className="opex-about-rail">
            {/* Folio */}
            <motion.div
              {...rise(0)}
              className="opex-about-folio"
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 26,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 15,
                  color: VIOLET_BRIGHT,
                }}
              >
                №
              </span>
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
                Issue 01 · The Series
              </span>
            </motion.div>

            {/* Kicker */}
            <motion.div {...rise(0.06)} style={{ marginBottom: 18 }}>
              <span
                style={{
                  display: "block",
                  width: 24,
                  height: 1,
                  background: VIOLET_BRIGHT,
                  marginBottom: 14,
                }}
              />
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
                About OPEX First
              </span>
            </motion.div>

            {/* Headline */}
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
              Where execution gets{" "}
              <span
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: VIOLET_BRIGHT,
                }}
              >
                engineered.
              </span>
            </motion.h2>

            {/* Standfirst */}
            <motion.p
              {...rise(0.18)}
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "31ch",
                margin: 0,
              }}
            >
              The region&apos;s only summit series built for the execution
              decade — where Vision 2030 ambition becomes measurable
              operational performance.
            </motion.p>

            {/* Colophon — stat ledger */}
            <motion.div
              {...rise(0.26)}
              className="opex-about-colophon"
              style={{ marginTop: 40 }}
            >
              {COLOPHON.map((s, i) => (
                <div
                  key={s.label}
                  className="opex-about-col-row"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 0",
                    borderTop:
                      i === 0
                        ? "none"
                        : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(23px, 2.2vw, 30px)",
                      letterSpacing: "-0.5px",
                      color: VIOLET_BRIGHT,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "1.6px",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.42)",
                      textAlign: "right",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT WELL ─────────────────────────────────────── */}
          <div className="opex-about-well">
            {/* Lead photographic plate */}
            <motion.figure
              {...rise(0.1)}
              className="opex-about-plate"
              style={{ margin: 0, position: "relative" }}
            >
              <div className="opex-about-plate-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLATE_IMG}
                  alt="OPEX First — leaders in session"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "saturate(0.92) brightness(0.82)",
                  }}
                />
                <span className="opex-crop opex-crop-tl" />
                <span className="opex-crop opex-crop-tr" />
                <span className="opex-crop opex-crop-bl" />
                <span className="opex-crop opex-crop-br" />
              </div>
              <figcaption
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.44)",
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 1,
                    background: "rgba(159,103,255,0.5)",
                    flexShrink: 0,
                  }}
                />
                OPEX First UAE — the operational-excellence room, Abu Dhabi.
              </figcaption>
            </motion.figure>

            {/* Editor's note */}
            <motion.div {...rise(0.2)} style={{ marginTop: "clamp(36px, 4vw, 52px)" }}>
              <p className="opex-about-lede">
                The Gulf is in the middle of an unprecedented economic
                transformation — Saudi Arabia&apos;s Vision 2030, the
                UAE&apos;s Operation 300bn, Kuwait&apos;s New Kuwait 2035,
                and trillions in giga-projects, industrial diversification,
                and digital transformation. But vision without execution is
                just a plan. OPEX First is where execution gets engineered.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: "clamp(15px, 1.15vw, 17px)",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.62)",
                  margin: "20px 0 0",
                  maxWidth: "58ch",
                }}
              >
                It is the region&apos;s only dedicated platform for
                operational excellence — uniting government authorities,
                business leaders, and global technology innovators to set new
                benchmarks for efficiency, sustainability, and performance.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Field notes — full-width market-intelligence strip */}
        <motion.div
          {...rise(0.3)}
          className="opex-about-notes-row"
          style={{
            marginTop: "clamp(48px, 6vw, 80px)",
            paddingTop: "clamp(30px, 3.5vw, 46px)",
            borderTop: "1px solid rgba(255,255,255,0.09)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            columnGap: "clamp(28px, 4vw, 56px)",
          }}
        >
          {FIELD_NOTES.map((n, i) => (
            <div
              key={n.num}
              className="opex-about-note"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "clamp(14px, 1.4vw, 22px)",
                alignItems: "start",
                paddingLeft: i === 0 ? 0 : "clamp(20px, 3vw, 44px)",
                borderLeft:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(30px, 3vw, 44px)",
                  lineHeight: 0.9,
                  letterSpacing: "-1.5px",
                  color: "transparent",
                  WebkitTextStroke: "1.4px rgba(159,103,255,0.28)",
                }}
              >
                {n.num}
              </span>
              <div>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "2.4px",
                    textTransform: "uppercase",
                    color: VIOLET_BRIGHT,
                    marginBottom: 8,
                  }}
                >
                  {n.kicker}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 400,
                    fontSize: "clamp(14px, 1.05vw, 16px)",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                    margin: 0,
                  }}
                >
                  {n.line}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-about-spread {
          display: grid;
          grid-template-columns: minmax(230px, 290px) 1fr;
          column-gap: clamp(48px, 6vw, 96px);
          align-items: start;
        }
        .opex-about-rail {
          position: sticky;
          top: 120px;
          align-self: start;
        }
        .opex-about-plate-img {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          border-radius: 2px;
        }
        .opex-crop {
          position: absolute;
          width: 15px;
          height: 15px;
          pointer-events: none;
          z-index: 2;
        }
        .opex-crop-tl {
          top: 10px;
          left: 10px;
          border-top: 1px solid rgba(159, 103, 255, 0.7);
          border-left: 1px solid rgba(159, 103, 255, 0.7);
        }
        .opex-crop-tr {
          top: 10px;
          right: 10px;
          border-top: 1px solid rgba(159, 103, 255, 0.7);
          border-right: 1px solid rgba(159, 103, 255, 0.7);
        }
        .opex-crop-bl {
          bottom: 10px;
          left: 10px;
          border-bottom: 1px solid rgba(159, 103, 255, 0.7);
          border-left: 1px solid rgba(159, 103, 255, 0.7);
        }
        .opex-crop-br {
          bottom: 10px;
          right: 10px;
          border-bottom: 1px solid rgba(159, 103, 255, 0.7);
          border-right: 1px solid rgba(159, 103, 255, 0.7);
        }
        .opex-about-lede {
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: clamp(16px, 1.35vw, 19px);
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.82);
          margin: 0;
          max-width: 58ch;
        }
        .opex-about-lede::first-letter {
          font-family: ${SERIF};
          font-style: italic;
          font-weight: 400;
          font-size: 3.4em;
          line-height: 0.82;
          float: left;
          margin: 6px 12px 0 0;
          color: ${VIOLET_BRIGHT};
        }

        @media (max-width: 900px) {
          .opex-about-spread {
            grid-template-columns: 1fr;
            row-gap: clamp(40px, 7vw, 56px);
          }
          .opex-about-rail {
            position: static;
            top: auto;
          }
          .opex-about-colophon {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          }
          .opex-about-col-row {
            flex-direction: column;
            align-items: flex-start !important;
            justify-content: center;
            gap: 6px !important;
            padding: 16px 14px 16px 0 !important;
            border-top: none !important;
            border-left: 1px solid rgba(255, 255, 255, 0.07);
          }
          .opex-about-col-row:first-child {
            border-left: none;
            padding-left: 0 !important;
          }
          .opex-about-col-row span:last-child {
            text-align: left !important;
          }
        }
        @media (max-width: 760px) {
          .opex-about-notes-row {
            grid-template-columns: 1fr !important;
          }
          .opex-about-notes-row .opex-about-note {
            padding-left: 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            padding-top: 22px;
            padding-bottom: 2px;
          }
          .opex-about-notes-row .opex-about-note:first-child {
            border-top: none;
            padding-top: 0;
          }
        }
        @media (max-width: 560px) {
          .opex-about-colophon {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-about-col-row {
            border-top: 1px solid rgba(255, 255, 255, 0.07) !important;
            padding: 14px 12px !important;
          }
          .opex-about-col-row:nth-child(-n + 2) {
            border-top: none !important;
          }
          .opex-about-col-row:nth-child(odd) {
            border-left: none;
            padding-left: 0 !important;
          }
          .opex-about-note {
            gap: 14px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-about-rail {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}
