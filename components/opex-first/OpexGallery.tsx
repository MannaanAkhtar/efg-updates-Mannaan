"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const OF = "https://opexfirst.com/wp-content/uploads/2025/10";
const KSA = "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few";
const UAE = "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE";

type Photo = { id: string; src: string; city: string; w: number };

const photos: Photo[] = [
  { id: "1", src: `${OF}/DSC08180.jpg`, city: "Riyadh", w: 1.5 },
  { id: "2", src: `${UAE}/4N8A1666.JPG`, city: "Abu Dhabi", w: 1.1 },
  { id: "3", src: `${KSA}/DSC08585.jpg`, city: "Riyadh", w: 1.35 },
  { id: "4", src: `${OF}/DSC08142.jpg`, city: "Riyadh", w: 1.65 },
  { id: "5", src: `${UAE}/4N8A1702.JPG`, city: "Abu Dhabi", w: 1.15 },
  { id: "6", src: `${KSA}/DSC08580.jpg`, city: "Riyadh", w: 1.4 },
  { id: "7", src: `${OF}/DSC08203.jpg`, city: "Riyadh", w: 1.0 },
  { id: "8", src: `${UAE}/4N8A1751.JPG`, city: "Abu Dhabi", w: 1.55 },
  { id: "9", src: `${KSA}/DSC08456.jpg`, city: "Riyadh", w: 1.25 },
  { id: "10", src: `${OF}/DSC08170.jpg`, city: "Riyadh", w: 1.45 },
  { id: "11", src: `${UAE}/4N8A1848.JPG`, city: "Abu Dhabi", w: 1.15 },
  { id: "12", src: `${KSA}/DSC08269.jpg`, city: "Riyadh", w: 1.6 },
  { id: "13", src: `${OF}/DSC08553.jpg`, city: "Riyadh", w: 1.3 },
  { id: "14", src: `${UAE}/4N8A1950.JPG`, city: "Abu Dhabi", w: 1.2 },
  { id: "15", src: `${KSA}/DSC08208.jpg`, city: "Riyadh", w: 1.5 },
  { id: "16", src: `${OF}/DSC08609.jpg`, city: "Riyadh", w: 1.05 },
  { id: "17", src: `${KSA}/DSC08336.jpg`, city: "Riyadh", w: 1.4 },
  { id: "18", src: `${KSA}/DSC08533.jpg`, city: "Riyadh", w: 1.3 },
];

const marqueeRow = photos.slice(0, 12);
const staticRow = photos.slice(12);

function Cell({ p }: { p: Photo }) {
  return (
    <>
      <Image
        src={p.src}
        alt={`OPEX First — ${p.city}`}
        fill
        sizes="(max-width: 760px) 48vw, 32vw"
        draggable={false}
        className="opex-ga-img"
      />
      <div className="opex-ga-cell-overlay" />
      <figcaption className="opex-ga-cell-cap">
        <span className="opex-ga-cell-dot" />
        {p.city}
      </figcaption>
    </>
  );
}

export default function OpexGallery() {
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
      {/* ── Header ───────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <div className="opex-ga-head">
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
                The Archive
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
              From Previous Editions
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
              The OPEX First{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                Experience.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-ga-dek"
          >
            Scenes from Riyadh and Abu Dhabi — the operational-excellence
            community, in the room.
          </motion.p>
        </div>

        <div className="opex-ga-rule" />
      </div>

      {/* ── Two full-bleed rows ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="opex-ga-rows"
      >
        {/* Row 1 — marquee */}
        <div className="opex-ga-mrow">
          <div className="opex-ga-mtrack">
            {[...marqueeRow, ...marqueeRow].map((p, i) => (
              <figure
                key={`${p.id}-${i}`}
                className="opex-ga-cell opex-ga-cell-m"
                style={{ width: `${p.w * 400}px` }}
              >
                <Cell p={p} />
              </figure>
            ))}
          </div>
        </div>

        {/* Row 2 — static justified */}
        <div className="opex-ga-srow">
          {staticRow.map((p) => (
            <figure
              key={p.id}
              className="opex-ga-cell opex-ga-cell-s"
              style={{ flexGrow: p.w, flexBasis: 0 }}
            >
              <Cell p={p} />
            </figure>
          ))}
        </div>

        <div className="opex-ga-rows-fade" aria-hidden />
      </motion.div>

      <style jsx global>{`
        .opex-ga-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-ga-dek {
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
        .opex-ga-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 0;
        }

        .opex-ga-rows {
          position: relative;
          margin-top: clamp(28px, 3.4vw, 44px);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .opex-ga-mrow {
          height: clamp(250px, 28vw, 400px);
          overflow: hidden;
        }
        .opex-ga-mtrack {
          display: flex;
          gap: 3px;
          height: 100%;
          width: max-content;
          animation: opexGaMarquee 60s linear infinite;
          will-change: transform;
        }
        .opex-ga-mrow:hover .opex-ga-mtrack {
          animation-play-state: paused;
        }
        @keyframes opexGaMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .opex-ga-srow {
          height: clamp(250px, 28vw, 400px);
          display: flex;
          gap: 3px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .opex-ga-srow::-webkit-scrollbar {
          display: none;
        }

        .opex-ga-cell {
          position: relative;
          height: 100%;
          margin: 0;
          overflow: hidden;
          flex-shrink: 0;
        }
        .opex-ga-cell-s {
          min-width: 200px;
        }
        .opex-ga-img {
          object-fit: cover;
          user-select: none;
          -webkit-user-drag: none;
          filter: brightness(0.9) contrast(1.03) saturate(1.05);
          transition: filter 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-ga-cell:hover .opex-ga-img {
          filter: brightness(1.05) contrast(1.03) saturate(1.1);
          transform: scale(1.06);
        }
        .opex-ga-cell-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to top, rgba(124, 58, 237, 0.32) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        .opex-ga-cell:hover .opex-ga-cell-overlay {
          opacity: 1;
        }
        .opex-ga-cell-cap {
          position: absolute;
          left: 14px;
          bottom: 12px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: ${SERIF};
          font-style: italic;
          font-size: 14px;
          color: #fff;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-ga-cell:hover .opex-ga-cell-cap {
          opacity: 1;
          transform: translateY(0);
        }
        .opex-ga-cell-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${VIOLET_BRIGHT};
          box-shadow: 0 0 8px ${VIOLET_BRIGHT};
        }
        .opex-ga-rows-fade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            #07051a 0%,
            transparent 7%,
            transparent 93%,
            #07051a 100%
          );
        }

        @media (max-width: 760px) {
          .opex-ga-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-ga-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
          .opex-ga-mrow,
          .opex-ga-srow {
            height: clamp(190px, 50vw, 280px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-ga-mtrack {
            animation: none !important;
          }
          .opex-ga-mrow {
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}
