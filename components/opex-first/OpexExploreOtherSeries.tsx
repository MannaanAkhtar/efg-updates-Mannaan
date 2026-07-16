"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

type Series = {
  id: string;
  num: string;
  name: string;
  mark: string; // wordmark lead (styled bold)
  markTail?: string; // wordmark tail (styled light)
  tagline: string;
  color: string;
  href: string;
};

const otherSeries: Series[] = [
  {
    id: "cyber-first",
    num: "01",
    name: "Cyber First",
    mark: "Cyber",
    markTail: "First",
    tagline: "Defending the digital frontier",
    color: "#01BBF5",
    href: "/events/cyber-first",
  },
  {
    id: "ot-security",
    num: "02",
    name: "OT Security First",
    mark: "OT Security",
    markTail: "First",
    tagline: "Protecting what runs the world",
    color: "#D34B9A",
    href: "/events/ot-security-first",
  },
  {
    id: "data-ai",
    num: "03",
    name: "Digital First",
    mark: "Digital",
    markTail: "First",
    tagline: "Intelligence at the speed of business",
    color: "#11A385",
    href: "/events/data-ai-first",
  },
  {
    id: "network-first",
    num: "04",
    name: "NetworkFirst",
    mark: "Network",
    markTail: "First",
    tagline: "Executive boardrooms, by invitation",
    color: "#C9935A",
    href: "/network-first",
  },
];

export default function OpexExploreOtherSeries() {
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
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* ── Editorial header ─────────────────────────────────── */}
        <div className="opex-os-head">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 20 }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: VIOLET_BRIGHT }}>№</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.34)" }}>
                The Group
              </span>
            </div>
            <span style={{ display: "block", width: 24, height: 1, background: VIOLET_BRIGHT, marginBottom: 14 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3.4px", textTransform: "uppercase", color: VIOLET_BRIGHT }}>
              From Events First Group
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(32px, 3.6vw, 54px)", letterSpacing: "-1.4px", lineHeight: 1.04, color: OFFWHITE, margin: "16px 0 0" }}>
              Explore the other{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                series.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-os-dek"
          >
            Five programmes, one standard of the room — cybersecurity, critical
            infrastructure, digital, and the executive boardroom.
          </motion.p>
        </div>

        <div className="opex-os-rule" />

        {/* ── Series brand tiles ───────────────────────────────── */}
        <div className="opex-os-grid">
          {otherSeries.map((series, index) => (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.09, ease: EASE }}
            >
              <SeriesCard series={series} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .opex-os-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-os-dek {
          font-family: ${SERIF};
          font-style: italic;
          font-weight: 400;
          font-size: clamp(14px, 1.15vw, 16.5px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          max-width: 36ch;
          margin: 0;
          padding-bottom: 6px;
        }
        .opex-os-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 clamp(30px, 3.6vw, 46px);
        }
        .opex-os-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(14px, 1.5vw, 20px);
        }

        .opex-os-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          padding: clamp(18px, 1.7vw, 24px);
          background:
            radial-gradient(120% 90% at 78% 118%, var(--sc) -18%, transparent 62%),
            linear-gradient(150deg, rgba(12, 9, 34, 0.72) 0%, rgba(9, 7, 26, 0.94) 100%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-os-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background: radial-gradient(120% 90% at 78% 118%, var(--sc) -12%, transparent 58%);
          opacity: 0;
          transition: opacity 0.55s ease;
        }
        .opex-os-card:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sc) 42%, transparent),
            0 20px 46px rgba(0, 0, 0, 0.5);
        }
        .opex-os-card:hover::before {
          opacity: 0.5;
        }
        .opex-os-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--sc);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 3;
        }
        .opex-os-card:hover .opex-os-accent {
          transform: scaleX(1);
        }
        .opex-os-crop {
          position: absolute;
          width: 13px;
          height: 13px;
          z-index: 3;
          pointer-events: none;
          border-color: rgba(255, 255, 255, 0.2) !important;
          transition: border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-os-card:hover .opex-os-crop {
          border-color: color-mix(in srgb, var(--sc) 60%, transparent) !important;
        }

        .opex-os-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .opex-os-folio {
          font-family: ${SERIF};
          font-style: italic;
          font-size: 15px;
          color: var(--sc);
        }
        .opex-os-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--sc);
          box-shadow: 0 0 12px var(--sc);
        }

        /* Wordmark lockup — acts as the series logo */
        .opex-os-mark {
          position: relative;
          z-index: 2;
          margin: auto 0;
          padding: 12px 0;
        }
        .opex-os-mark-line {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(24px, 2.3vw, 34px);
          letter-spacing: -1.2px;
          line-height: 0.98;
          color: ${OFFWHITE};
          display: block;
        }
        .opex-os-mark-tail {
          font-family: var(--font-display);
          font-weight: 300;
          color: var(--sc);
        }
        .opex-os-mark-rule {
          display: block;
          width: 30px;
          height: 2px;
          margin-top: 14px;
          background: var(--sc);
        }

        .opex-os-bottom {
          position: relative;
          z-index: 2;
        }
        .opex-os-tag {
          font-family: ${SERIF};
          font-style: italic;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          line-height: 1.4;
        }
        .opex-os-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: var(--sc);
          opacity: 0.55;
          transform: translateX(0);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-os-card:hover .opex-os-cta {
          opacity: 1;
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .opex-os-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 760px) {
          .opex-os-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-os-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
        }
        @media (max-width: 480px) {
          .opex-os-grid {
            grid-template-columns: 1fr;
          }
          .opex-os-card {
            aspect-ratio: 16 / 9;
          }
        }
      `}</style>
    </section>
  );
}

function SeriesCard({ series }: { series: Series }) {
  return (
    <Link href={series.href} className="opex-os-card" style={{ ["--sc" as string]: series.color }}>
      <span className="opex-os-accent" />

      <span className="opex-os-crop" style={{ top: 10, left: 10, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <span className="opex-os-crop" style={{ bottom: 10, right: 10, borderBottom: "1px solid", borderRight: "1px solid" }} />

      {/* Top: folio + brand dot */}
      <div className="opex-os-top">
        <span className="opex-os-folio">{series.num}</span>
        <span className="opex-os-dot" />
      </div>

      {/* Center: wordmark lockup */}
      <div className="opex-os-mark">
        <span className="opex-os-mark-line">
          {series.mark}
          {series.markTail ? <span className="opex-os-mark-tail"> {series.markTail}</span> : null}
        </span>
        <span className="opex-os-mark-rule" />
      </div>

      {/* Bottom: tagline + CTA */}
      <div className="opex-os-bottom">
        <p className="opex-os-tag">{series.tagline}</p>
        <span className="opex-os-cta">
          Explore
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
