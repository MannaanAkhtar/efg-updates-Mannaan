"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";

interface PastEvent {
  series: string;
  title: string;
  subtitle: string;
  date: string;
  format: string;
  href: string;
  brandColor: string;
  brandLogo: string;
  logoHeight: number;
}

const PAST_EVENTS: PastEvent[] = [
  {
    series: "Cyber First",
    title: "Cyber First East Africa",
    subtitle: "East Africa's premier cybersecurity summit — C-level executives and policymakers aligning against digital warfare. Nairobi, Kenya.",
    date: "08 July 2026",
    format: "Summit · Nairobi",
    href: "/events/cyber-first/kenya-2026",
    brandColor: "#8B1A22",
    brandLogo: "/Cyber-First-East-Africa-Logo-01.png",
    logoHeight: 92,
  },
  {
    series: "OT Security First",
    title: "OT Security in the Age of AI Threats",
    subtitle: "Closed virtual forum for OT security leaders across MENA energy & utilities — 100 verified professionals.",
    date: "19 May 2026",
    format: "Virtual Forum · MENA",
    href: "/events/ot-security-first/virtual-boardroom-mena",
    brandColor: "#D34B9A",
    brandLogo: `${S3}/logos/Untitled-2-01.png`,
    logoHeight: 96,
  },
  {
    series: "OPEX First",
    title: "Process Intelligence MENA",
    subtitle: "Executive webinar on turning digital investment into measurable execution — 100 senior executives.",
    date: "21 May 2026",
    format: "Executive Webinar · MENA",
    href: "/events/opex-first/process-intelligence",
    brandColor: "#7C3AED",
    brandLogo: `${S3}/logos/OPEX+FIRST+logo-1.png`,
    logoHeight: 80,
  },
];

export default function PastEvents2026() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(72px, 7vw, 112px) 0 clamp(88px, 8vw, 128px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          marginBottom: "clamp(36px, 4vw, 56px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--orange)",
            marginBottom: "12px",
          }}
        >
          This Year · 2026
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3.5vw, 48px)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Recently Delivered
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(14px, 1.2vw, 16px)",
            color: "rgba(255,255,255,0.45)",
            margin: "12px 0 0",
            maxWidth: "520px",
          }}
        >
          A look back at the executive sessions we ran this year.
        </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Link
            href="/events"
            className="pe-all-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-outfit)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.03em",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              padding: "11px 20px",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "50px",
            }}
          >
            All 2026 events
            <span className="pe-all-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>→</span>
          </Link>
        </motion.div>
      </div>

      {/* Cards */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <div
          className="past-events-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(20px, 2vw, 28px)",
          }}
        >
          {PAST_EVENTS.map((e, i) => (
            <motion.div
              key={e.href}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={e.href} className="past-event-card" style={{ textDecoration: "none" }}>
                {/* Brand panel */}
                <div
                  className="past-event-panel"
                  style={{
                    position: "relative",
                    height: "clamp(158px, 13vw, 200px)",
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${e.brandColor}f2 0%, ${e.brandColor}99 42%, #0a0a0a 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Radial glow */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse 60% 80% at 30% 25%, ${e.brandColor}40, transparent 60%)`,
                    }}
                  />
                  {/* Top accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, transparent, ${e.brandColor}, transparent)`,
                    }}
                  />
                  {/* Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.brandLogo}
                    alt={`${e.series} logo`}
                    className="past-event-logo"
                    style={{
                      height: e.logoHeight,
                      width: "auto",
                      maxWidth: "82%",
                      objectFit: "contain",
                      opacity: 0.92,
                      filter: "brightness(0) invert(1) drop-shadow(0 4px 16px rgba(0,0,0,0.4))",
                      position: "relative",
                      zIndex: 2,
                    }}
                  />
                  {/* Past badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      zIndex: 3,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: "50px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.6)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      Past Event
                    </span>
                  </div>
                  {/* Bottom fade */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />
                </div>

                {/* Content */}
                <div
                  style={{
                    background: "#0d0d0d",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: "none",
                    padding: "clamp(22px, 2.4vw, 30px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.4px",
                        textTransform: "uppercase",
                        color: e.brandColor,
                      }}
                    >
                      {e.series}
                    </span>
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {e.date}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(18px, 1.7vw, 23px)",
                      fontWeight: 800,
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {e.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {e.subtitle}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "6px",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {e.format}
                    </span>
                    <span
                      className="past-event-cta"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "var(--font-outfit)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: e.brandColor,
                      }}
                    >
                      View recap
                      <span className="past-event-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .past-event-card {
          display: block;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .past-event-card:hover {
          transform: translateY(-4px);
        }
        .past-event-logo {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .past-event-card:hover .past-event-logo {
          transform: scale(1.05);
        }
        .past-event-card:hover .past-event-arrow {
          transform: translateX(4px);
        }
        .pe-all-link {
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .pe-all-link:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.28);
        }
        .pe-all-link:hover .pe-all-arrow {
          transform: translateX(4px);
        }
        @media (max-width: 1024px) {
          .past-events-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .past-events-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
