"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

type Sponsor = { name: string; logo: string | null };

// All series partners, mixed across tiers into one flowing marquee.
const sponsors: Sponsor[] = [
  { name: "Celonis", logo: `${S3}/Celonis.png` },
  { name: "EY", logo: `${S3}/EY.png` },
  { name: "Profit.co", logo: `${S3}/profit.co.png` },
  { name: "Botteq", logo: `${S3}/BOT-teq.png` },
  { name: "Cyborg", logo: `${S3}/Cyborg-automation-hub.png` },
  { name: "Red Sand", logo: `${S3}/redsand.png` },
  { name: "ARIS", logo: `${S3}/aris.png` },
  { name: "SAP Signavio", logo: `${S3}/sap-signavio.png` },
  { name: "Moxo", logo: `${S3}/moxo.png` },
  { name: "Kafaa", logo: `${S3}/KAfaa.png` },
  { name: "Minds Advisory", logo: `${S3}/minds-advisory.png` },
  { name: "Abu Dhabi University", logo: `${S3}/abu-dhabi-university.png` },
  { name: "ISRAR", logo: `${S3}/ISRAR.png` },
  { name: "Industry Events", logo: `${S3}/Industry-Events.png` },
  { name: "Bridge", logo: null },
  { name: "Blue Prism", logo: null },
  { name: "Agile MENA", logo: null },
  { name: "King Saud University", logo: null },
  { name: "Gulf Business", logo: null },
  { name: "Trade Arabia", logo: null },
  { name: "Tahawul Tech", logo: null },
  { name: "GEC News", logo: null },
  { name: "Economy Middle East", logo: null },
];

export default function OpexSponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const rowTop = sponsors.filter((_, i) => i % 2 === 0);
  const rowBottom = sponsors.filter((_, i) => i % 2 === 1);

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
      {/* ── Header ───────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <div className="opex-sp-head">
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
                The Partners
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
              Series Sponsors &amp; Partners
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
              Trusted by Industry{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                Leaders.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-sp-dek"
          >
            20+ partners across technology, consulting, and academia — powering
            operational excellence across the series.
          </motion.p>
        </div>

        <div className="opex-sp-rule" />
      </div>

      {/* ── Logo marquee (full-bleed, two rows) ──────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="opex-sp-marquee"
      >
        <SponsorRow items={rowTop} direction="left" duration={56} />
        <SponsorRow items={rowBottom} direction="right" duration={50} />
      </motion.div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="opex-sp-cta-wrap"
        >
          <Link href="/sponsors-and-partners" className="opex-sp-cta">
            Sponsor the next edition
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-sp-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-sp-dek {
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
        .opex-sp-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 0;
        }

        .opex-sp-marquee {
          margin: clamp(34px, 4.2vw, 54px) 0 clamp(30px, 3.6vw, 46px);
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 2.4vw, 34px);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
        }
        .opex-sp-row {
          display: flex;
          overflow: hidden;
        }
        .opex-sp-track {
          display: flex;
          align-items: center;
          gap: clamp(48px, 5.5vw, 88px);
          flex-shrink: 0;
          width: max-content;
          will-change: transform;
        }
        .opex-sp-track-left {
          animation: opexSpMarqueeLeft linear infinite;
        }
        .opex-sp-track-right {
          animation: opexSpMarqueeRight linear infinite;
        }
        .opex-sp-row:hover .opex-sp-track {
          animation-play-state: paused;
        }
        @keyframes opexSpMarqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes opexSpMarqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .opex-sp-item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 80px;
          flex-shrink: 0;
        }
        .opex-sp-logo {
          max-height: 62px;
          max-width: 200px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.9;
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-sp-item:hover .opex-sp-logo {
          opacity: 1;
          transform: translateY(-2px);
        }
        .opex-sp-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 0.3px;
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.4s ease;
        }
        .opex-sp-item:hover .opex-sp-name {
          color: rgba(255, 255, 255, 0.85);
        }

        .opex-sp-cta-wrap {
          display: flex;
          justify-content: center;
          margin-top: clamp(8px, 1.5vw, 16px);
        }
        .opex-sp-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 24px;
          border-radius: 999px;
          border: 1px solid rgba(159, 103, 255, 0.3);
          background: rgba(124, 58, 237, 0.06);
          text-decoration: none;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: rgba(255, 255, 255, 0.82);
          transition: color 0.4s, border-color 0.4s, background 0.4s;
        }
        .opex-sp-cta:hover {
          color: #fff;
          border-color: rgba(159, 103, 255, 0.55);
          background: rgba(124, 58, 237, 0.14);
        }
        .opex-sp-cta svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-sp-cta:hover svg {
          transform: translateX(3px);
        }

        @media (max-width: 760px) {
          .opex-sp-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-sp-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-sp-track-left,
          .opex-sp-track-right {
            animation: none !important;
          }
          .opex-sp-row {
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}

function SponsorRow({
  items,
  direction,
  duration,
}: {
  items: Sponsor[];
  direction: "left" | "right";
  duration: number;
}) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="opex-sp-row">
      <div
        className={`opex-sp-track ${direction === "left" ? "opex-sp-track-left" : "opex-sp-track-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((s, i) => (
          <div key={`${s.name}-${i}`} className="opex-sp-item">
            {s.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logo} alt={s.name} className="opex-sp-logo" />
            ) : (
              <span className="opex-sp-name">{s.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
