"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { POST_EVENT_REPORTS } from "./postEventReportsData";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const INK = "#07051A";
const RULE = "rgba(124,58,237,0.18)";
const MUTE = "#9b96b8";
const FAINT = "#6b6786";
const EASE = [0.16, 1, 0.3, 1] as const;

export default function OpexPostEventReports({
  onRequestReport,
}: {
  // When provided, card clicks call this instead of the default series behaviour
  // (used by the Saudi 2026 page to open its own request modal).
  onRequestReport?: (reportUrl: string) => void;
} = {}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="reports"
      style={{
        background: "transparent",
        padding: "clamp(36px, 4.5vw, 64px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 20%, rgba(124,58,237,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.35,
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 56px)" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 50,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: VIOLET_BRIGHT,
              marginBottom: 20,
            }}
          >
            Post-Event Intelligence
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 4vw, 52px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            Reports from the{" "}
            <span
              className="opex-reports-shimmer"
              style={{
                background: `linear-gradient(110deg, ${VIOLET} 0%, #c4b5fd 40%, #fff 50%, #c4b5fd 60%, ${VIOLET} 100%)`,
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              room.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#9b96b8",
              maxWidth: 580,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Official post-event reports from each OPEX First edition — takeaways, on-stage themes, and sponsor coverage. Available as PDF.
          </p>
        </motion.div>

        {/* Card grid */}
        <div
          className="opex-reports-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(16px, 2vw, 28px)",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {POST_EVENT_REPORTS.map((report, i) => (
            <motion.button
              key={report.url}
              type="button"
              onClick={() => {
                if (onRequestReport) {
                  onRequestReport(report.url);
                  return;
                }
                document.querySelector("section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                window.dispatchEvent(
                  new CustomEvent("opex-series:open-request", {
                    detail: { type: "Past Event Report", reportUrl: report.url },
                  }),
                );
              }}
              className="opex-report-card"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "clamp(16px, 1.6vw, 22px)",
                textAlign: "left",
                font: "inherit",
                cursor: "pointer",
                width: "100%",
                background: `linear-gradient(165deg, rgba(28, 22, 50, 0.55) 0%, rgba(12, 10, 36, 0.65) 100%)`,
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                border: `1px solid rgba(255, 255, 255, 0.08)`,
                borderRadius: 16,
                textDecoration: "none",
                color: "white",
                overflow: "hidden",
                minHeight: 260,
                transition:
                  "border-color 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, backdrop-filter 0.4s ease",
                boxShadow: [
                  "inset 0 1px 0 rgba(255, 255, 255, 0.14)",
                  "inset 0 -1px 0 rgba(0, 0, 0, 0.4)",
                  "0 1px 2px rgba(0, 0, 0, 0.45)",
                  "0 10px 28px rgba(0, 0, 0, 0.30)",
                  "0 28px 56px rgba(0, 0, 0, 0.32)",
                ].join(", "),
              }}
            >
              {/* Glass sheen */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 28%, transparent 50%, transparent 75%, rgba(255,255,255,0.03) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Inner bevel */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 1,
                  borderRadius: 15,
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.025)",
                  pointerEvents: "none",
                }}
              />

              {/* Top hairline */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "8%",
                  right: "8%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent 0%, ${VIOLET_BRIGHT} 50%, transparent 100%)`,
                  opacity: 0.7,
                }}
              />

              {/* Bottom hairline */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "20%",
                  right: "20%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent 0%, ${VIOLET_BRIGHT}55 50%, transparent 100%)`,
                }}
              />

              {/* Top meta */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "clamp(10px, 1.2vh, 14px)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: MUTE,
                  }}
                >
                  <span
                    style={{
                      fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: 13,
                      letterSpacing: "normal",
                      textTransform: "none",
                      color: VIOLET_BRIGHT,
                    }}
                  >
                    №
                  </span>
                  {(i + 1).toString().padStart(2, "0")} · OPEX First
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 9px",
                    borderRadius: 999,
                    border: `1px solid ${RULE}`,
                    background: "rgba(255,255,255,0.02)",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: FAINT,
                  }}
                >
                  PDF
                </span>
              </div>

              {/* Logo zone */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 100,
                  marginBottom: "clamp(10px, 1.4vh, 14px)",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "-20% -10%",
                    background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(124,58,237,0.14) 0%, transparent 70%)`,
                    filter: "blur(20px)",
                    pointerEvents: "none",
                  }}
                />
                {report.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={report.logo}
                    alt={report.title}
                    className="opex-report-logo"
                    style={
                      {
                        position: "relative",
                        maxHeight: 100,
                        maxWidth: "85%",
                        width: "auto",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 16px rgba(124,58,237,0.20))",
                        transform: "scale(var(--logo-scale, 1))",
                        transition:
                          "transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease",
                        ["--logo-scale" as string]: String(report.logoScale ?? 1),
                      } as React.CSSProperties
                    }
                  />
                ) : (
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(18px, 1.6vw, 22px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        color: "white",
                        margin: 0,
                      }}
                    >
                      {report.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Centered hairline */}
              <div
                aria-hidden
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 18, height: 1, background: RULE }} />
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: VIOLET_BRIGHT,
                    boxShadow: `0 0 6px rgba(159,103,255,0.6)`,
                  }}
                />
                <span style={{ width: 18, height: 1, background: RULE }} />
              </div>

              {/* Edition title */}
              <div style={{ textAlign: "center", marginBottom: "auto" }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(14px, 1.1vw, 16px)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "white",
                  }}
                >
                  {report.edition}{" "}
                  <span style={{ color: VIOLET_BRIGHT, fontWeight: 700 }}>·</span>{" "}
                  {report.year}
                </h3>
              </div>

              {/* CTA footer */}
              <div
                style={{
                  marginTop: "clamp(12px, 1.6vh, 18px)",
                  paddingTop: 12,
                  borderTop: `1px solid ${RULE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "white",
                  }}
                >
                  Request Report
                </span>
                <span
                  aria-hidden
                  className="opex-report-arrow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: `1px solid rgba(124,58,237,0.25)`,
                    background: `rgba(124,58,237,0.08)`,
                    color: VIOLET_BRIGHT,
                    lineHeight: 1,
                    transition:
                      "background 0.4s ease, border-color 0.4s ease, color 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .opex-reports-shimmer {
          animation: opex-reports-shimmer 6s linear infinite;
        }
        @keyframes opex-reports-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .opex-report-card:hover {
          border-color: rgba(159, 103, 255, 0.4) !important;
          transform: translateY(-3px);
          backdrop-filter: blur(34px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(34px) saturate(200%) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px rgba(124, 58, 237, 0.14),
            0 1px 2px rgba(0, 0, 0, 0.45),
            0 14px 36px rgba(124, 58, 237, 0.18),
            0 28px 64px rgba(0, 0, 0, 0.38) !important;
        }
        .opex-report-card:hover .opex-report-logo {
          transform: scale(calc(var(--logo-scale, 1) * 1.04)) !important;
          filter: drop-shadow(0 6px 24px rgba(124, 58, 237, 0.45)) !important;
        }
        .opex-report-card:hover .opex-report-arrow {
          background: ${VIOLET} !important;
          border-color: ${VIOLET} !important;
          color: white !important;
          transform: translateX(3px);
          box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
        }
        @media (max-width: 1000px) {
          .opex-reports-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 600px) {
          .opex-reports-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
