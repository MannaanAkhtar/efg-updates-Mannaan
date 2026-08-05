"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const INK = "#07051A";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

type Edition = {
  id: number;
  num: string;
  folio: string;
  status: "completed" | "upcoming";
  kicker: string;
  editionLabel?: string;
  city: string;
  country: string;
  caption?: string;
  dek?: string;
  dateline?: string;
  stat?: string | null;
  image: string;
  videoId?: string;
  href?: string;
  mirrored?: boolean;
};

const editions: Edition[] = [
  {
    id: 1,
    num: "01",
    folio: "01 / 03",
    status: "completed",
    kicker: "Completed · Sep 2025",
    editionLabel: "1st Edition",
    city: "Riyadh",
    country: "KSA",
    caption: "Riyadh Marriott — 9 September 2025",
    dateline: "OPEX First KSA · Riyadh, KSA",
    stat: "300+ leaders convened",
    image:
      "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few/DSC08585.jpg",
    videoId: "dbL42utoYW4",
  },
  {
    id: 2,
    num: "02",
    folio: "02 / 03",
    status: "completed",
    kicker: "Completed · Feb 2026",
    editionLabel: "2nd Edition",
    city: "Abu Dhabi",
    country: "UAE",
    caption: "St. Regis — 10 February 2026",
    dateline: "OPEX First UAE · Abu Dhabi, UAE",
    stat: null,
    image:
      "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1702.JPG",
    videoId: "5obYKv-vJZE",
    mirrored: true,
  },
  {
    id: 3,
    num: "03",
    folio: "03 / 03",
    status: "upcoming",
    kicker: "Live Edition · 21 Oct 2026",
    editionLabel: "3rd Edition",
    city: "Riyadh",
    country: "KSA",
    dek: "The flagship returns to Riyadh — registration now open.",
    image:
      "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few/DSC08269.jpg",
    href: "/events/opex-first/saudi-2026",
  },
];

const colophon = [
  { value: "3", label: "Editions" },
  { value: "2", label: "Nations" },
  { value: "300+", label: "Leaders Engaged" },
  { value: "Oct 2026", label: "Next Live Edition", live: true },
];

export default function OpexSeriesJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const openWebinarReport = () => {
    window.dispatchEvent(
      new CustomEvent("opex-series:open-request", {
        detail: {
          type: "Past Event Report",
          reportUrl:
            "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Process+Intelligence+Webinar+2026+-+Post+Event+Report.pdf",
        },
      }),
    );
  };

  return (
    <section
      ref={sectionRef}
      id="editions"
      style={{
        background: "transparent",
        padding: "clamp(72px, 9vw, 132px) 0",
        position: "relative",
        overflow: "hidden",
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
        <div className="opex-pgm-spread">
          {/* ── LEFT MASTHEAD RAIL ─────────────────────────────── */}
          <div className="opex-pgm-rail">
            {/* Folio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 7,
                marginBottom: 26,
              }}
            >
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: VIOLET_BRIGHT }}>
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
                Issue 01—03
              </span>
            </motion.div>

            {/* Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
              style={{ marginBottom: 20 }}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                style={{
                  display: "block",
                  width: 24,
                  height: 1,
                  background: VIOLET_BRIGHT,
                  transformOrigin: "left",
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
                The Programme
              </span>
            </motion.div>

            {/* Headline (mask reveal) */}
            <h2
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
              <span style={{ display: "block", overflow: "hidden" }}>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={inView ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
                  style={{ display: "block" }}
                >
                  The Series, in
                </motion.span>
              </span>
              <span style={{ display: "block", overflow: "hidden" }}>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={inView ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.8, delay: 0.26, ease: EASE }}
                  style={{ display: "block" }}
                >
                  Three{" "}
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                    Editions.
                  </span>
                </motion.span>
              </span>
            </h2>

            {/* Standfirst */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.34, ease: EASE }}
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "30ch",
                margin: 0,
              }}
            >
              Two chapters delivered across the Gulf, and the flagship&apos;s
              return to Riyadh this October — a field record of the
              operational-excellence movement, edition by edition.
            </motion.p>

            {/* Colophon */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
              style={{ marginTop: 44 }}
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
                  marginBottom: 12,
                }}
              >
                The Series in Numbers
              </span>
              <div
                className="opex-pgm-colophon"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              >
                {colophon.map((s) => (
                  <div
                    key={s.label}
                    className="opex-pgm-col-cell"
                    style={{ padding: "14px 0" }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(23px, 2.2vw, 31px)",
                        letterSpacing: "-0.5px",
                        color: VIOLET_BRIGHT,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 7,
                      }}
                    >
                      {s.live && (
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: VIOLET_BRIGHT,
                            boxShadow: `0 0 6px ${VIOLET_BRIGHT}`,
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 10.5,
                          fontWeight: 600,
                          letterSpacing: "1.6px",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.42)",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT GALLERY WELL ─────────────────────────────── */}
          <div className="opex-pgm-well">
            {editions.map((ed, i) => (
              <EditionEntry
                key={ed.id}
                ed={ed}
                index={i}
                inView={inView}
                onPlay={ed.videoId ? () => setActiveVideo(ed.videoId!) : undefined}
              />
            ))}

            {/* Virtual interlude — the series' digital chapter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.7, delay: 0.72, ease: EASE }}
              className="opex-pgm-interlude"
            >
              <div className="opex-pgm-il-main">
                <span className="opex-pgm-il-glyph" aria-hidden>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={VIOLET_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
                    <path d="M8 20.5h8M12 17v3.5" />
                    <path d="M10.5 8.2l4 2.3-4 2.3V8.2Z" fill={VIOLET_BRIGHT} stroke="none" />
                  </svg>
                </span>
                <div className="opex-pgm-il-body">
                  <span className="opex-pgm-il-kicker">
                    Also in the Series — Digital Supplement
                  </span>
                  <div className="opex-pgm-il-title">
                    Process Intelligence Webinar
                    <span className="opex-pgm-il-tag">Virtual · 2026</span>
                  </div>
                  <span className="opex-pgm-il-desc">
                    The series&apos; online session on process intelligence and
                    enterprise orchestration.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="opex-pgm-report"
                onClick={openWebinarReport}
              >
                Read the report
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Video Lightbox ─────────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveVideo(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(16px, 4vw, 48px)",
              background: "rgba(4,4,8,0.86)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 14 }}
              transition={{ duration: 0.34, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "min(1040px, 100%)",
                aspectRatio: "16 / 9",
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid rgba(159,103,255,0.24)",
                boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.15)",
                background: "#000",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="OPEX First edition highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </motion.div>
            <button
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              style={{
                position: "fixed",
                top: "clamp(16px, 3vw, 32px)",
                right: "clamp(16px, 3vw, 32px)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .opex-pgm-spread {
          display: grid;
          grid-template-columns: minmax(238px, 300px) 1fr;
          column-gap: clamp(48px, 6vw, 104px);
          align-items: start;
        }
        .opex-pgm-rail {
          position: sticky;
          top: 120px;
          align-self: start;
          padding-right: clamp(28px, 3vw, 48px);
          border-right: 1px solid rgba(159, 103, 255, 0.14);
        }
        .opex-pgm-colophon {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(16px, 2vw, 28px);
        }
        .opex-pgm-col-cell {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .opex-pgm-col-cell:nth-child(-n + 2) {
          border-top: none;
        }

        .opex-pgm-entry {
          position: relative;
          padding: clamp(40px, 4vw, 60px) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .opex-pgm-entry:first-child {
          border-top: none;
          padding-top: clamp(6px, 1vw, 12px);
        }
        .opex-pgm-entry-up {
          padding: clamp(56px, 5.5vw, 84px) 0;
        }
        .opex-pgm-numeral {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 0;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(150px, 20vw, 300px);
          line-height: 0.8;
          letter-spacing: -6px;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(159, 103, 255, 0.16);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
        }
        .opex-pgm-numeral-up {
          -webkit-text-stroke: 2px rgba(159, 103, 255, 0.3);
          font-size: clamp(160px, 22vw, 320px);
          animation: opexFloat 6s ease-in-out infinite;
        }
        .opex-pgm-inner {
          position: relative;
          z-index: 2;
          display: grid;
          column-gap: clamp(24px, 3vw, 44px);
          align-items: center;
        }
        .opex-pgm-plate {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          z-index: 1;
        }
        .opex-pgm-plate img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: filter 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-plate-completed img {
          filter: grayscale(0.28) brightness(0.6) contrast(1.02);
        }
        .opex-pgm-entry:hover .opex-pgm-plate-completed img {
          filter: grayscale(0) brightness(0.78);
          transform: scale(1.035);
        }
        .opex-pgm-crop {
          position: absolute;
          width: 14px;
          height: 14px;
          z-index: 3;
          pointer-events: none;
          transition: border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-entry:hover .opex-pgm-crop {
          border-color: rgba(159, 103, 255, 0.55) !important;
        }
        .opex-pgm-disc {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.92);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(7, 5, 26, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 4;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-entry:hover .opex-pgm-disc {
          transform: translate(-50%, -50%) scale(1);
          background: ${VIOLET};
          border-color: transparent;
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5);
        }
        .opex-pgm-disc svg path {
          fill: ${VIOLET_BRIGHT};
          transition: fill 0.4s;
        }
        .opex-pgm-entry:hover .opex-pgm-disc svg path {
          fill: #fff;
        }
        .opex-pgm-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 64px;
          height: 64px;
          margin: -32px 0 0 -32px;
          border-radius: 50%;
          border: 1px solid rgba(159, 103, 255, 0.5);
          opacity: 0;
          z-index: 3;
          pointer-events: none;
        }
        .opex-pgm-entry:hover .opex-pgm-ring {
          animation: opexPulseRing 1.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-watch {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: none;
          padding: 0;
          margin-top: 16px;
          cursor: pointer;
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.4s;
        }
        .opex-pgm-watch:hover {
          color: ${VIOLET_BRIGHT};
        }
        .opex-pgm-watch svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-watch:hover svg {
          transform: translateX(3px);
        }
        .opex-pgm-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: ${OFFWHITE};
          background: linear-gradient(${VIOLET_BRIGHT}, ${VIOLET_BRIGHT}) left bottom / 0 1px
            no-repeat;
          transition: background-size 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          padding-bottom: 3px;
        }
        .opex-pgm-entry-up:hover .opex-pgm-cta {
          background-size: 100% 1px;
        }
        .opex-pgm-cta svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-entry-up:hover .opex-pgm-cta svg {
          transform: translateX(4px);
        }
        .opex-pgm-uplink {
          display: block;
          text-decoration: none;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-uplink:hover {
          transform: translateY(-4px);
        }
        .opex-pgm-spine {
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(159, 103, 255, 0.7);
          z-index: 5;
        }

        .opex-pgm-interlude {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(20px, 3vw, 40px);
          padding: clamp(26px, 3vw, 36px) clamp(20px, 2.5vw, 30px);
          margin-top: clamp(12px, 2vw, 22px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-left: 2px solid rgba(159, 103, 255, 0.45);
          border-radius: 3px;
          background: linear-gradient(
            100deg,
            rgba(124, 58, 237, 0.06) 0%,
            rgba(124, 58, 237, 0.015) 42%,
            transparent 100%
          );
        }
        .opex-pgm-il-main {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2vw, 22px);
        }
        .opex-pgm-il-glyph {
          flex-shrink: 0;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(159, 103, 255, 0.28);
          background: rgba(124, 58, 237, 0.08);
        }
        .opex-pgm-il-body {
          display: flex;
          flex-direction: column;
        }
        .opex-pgm-il-kicker {
          display: block;
          font-family: var(--font-outfit);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(159, 103, 255, 0.72);
          margin-bottom: 8px;
        }
        .opex-pgm-il-title {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(18px, 1.6vw, 22px);
          letter-spacing: -0.4px;
          line-height: 1.1;
          color: ${OFFWHITE};
        }
        .opex-pgm-il-tag {
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: ${VIOLET_BRIGHT};
          padding: 4px 10px;
          border: 1px solid rgba(159, 103, 255, 0.3);
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.1);
          white-space: nowrap;
        }
        .opex-pgm-il-desc {
          font-family: ${SERIF};
          font-style: italic;
          font-weight: 400;
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.44);
          margin-top: 8px;
          max-width: 46ch;
        }
        .opex-pgm-report {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border: 1px solid rgba(159, 103, 255, 0.28);
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.06);
          cursor: pointer;
          font-family: var(--font-outfit);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.78);
          transition: color 0.4s, border-color 0.4s, background 0.4s;
        }
        .opex-pgm-report:hover {
          color: #fff;
          border-color: rgba(159, 103, 255, 0.55);
          background: rgba(124, 58, 237, 0.14);
        }
        .opex-pgm-report svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-pgm-report:hover svg {
          transform: translateX(3px);
        }

        @keyframes opexPulseRing {
          0% { transform: scale(1); opacity: 0.55; }
          70% { transform: scale(2.1); opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes opexFloat {
          0%, 100% { transform: translateY(calc(-50% - 3px)); }
          50% { transform: translateY(calc(-50% + 3px)); }
        }

        @media (max-width: 900px) {
          .opex-pgm-spread {
            grid-template-columns: 1fr;
            row-gap: clamp(40px, 7vw, 56px);
          }
          .opex-pgm-rail {
            position: static;
            top: auto;
            border-right: none;
            padding-right: 0;
          }
          .opex-pgm-colophon {
            grid-template-columns: repeat(4, 1fr);
            border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .opex-pgm-col-cell {
            border-top: none !important;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
            padding-left: 14px !important;
          }
          .opex-pgm-col-cell:first-child {
            border-left: none;
            padding-left: 0 !important;
          }
          .opex-pgm-inner {
            grid-template-columns: 1fr !important;
            row-gap: 22px;
          }
          .opex-pgm-inner > * {
            order: 0 !important;
            text-align: left !important;
          }
          .opex-pgm-plate-order {
            order: -1 !important;
          }
          .opex-pgm-numeral {
            font-size: clamp(110px, 26vw, 180px);
            top: -8px;
            transform: none;
            right: 0 !important;
            left: auto !important;
            -webkit-text-stroke-width: 1px;
          }
          .opex-pgm-numeral-up {
            animation: none;
          }
          .opex-pgm-spine {
            display: none;
          }
          .opex-pgm-textcol {
            align-items: flex-start !important;
            text-align: left !important;
          }
        }
        @media (max-width: 560px) {
          .opex-pgm-colophon {
            grid-template-columns: repeat(2, 1fr);
          }
          .opex-pgm-col-cell {
            border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
            padding: 14px 0 14px 14px !important;
          }
          .opex-pgm-col-cell:nth-child(-n + 2) {
            border-top: none !important;
          }
          .opex-pgm-col-cell:nth-child(odd) {
            border-left: none;
            padding-left: 0 !important;
          }
          .opex-pgm-interlude {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-pgm-rail { position: static; }
          .opex-pgm-numeral-up { animation: none; }
        }
      `}</style>
    </section>
  );
}

/* ─── Edition Entry ───────────────────────────────────────── */

function EditionEntry({
  ed,
  index,
  inView,
  onPlay,
}: {
  ed: Edition;
  index: number;
  inView: boolean;
  onPlay?: () => void;
}) {
  const isUp = ed.status === "upcoming";
  const mirrored = !!ed.mirrored;

  // Grid template: plate is wider; upcoming widest.
  const plateFr = isUp ? "1.6fr" : "1.15fr";
  const cols = mirrored ? `1fr ${plateFr}` : `${plateFr} 1fr`;

  const plate = (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 0 8% 0)" }}
      animate={
        inView
          ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
          : { opacity: 0, clipPath: "inset(0 0 8% 0)" }
      }
      transition={{ duration: 0.9, delay: 0.15 + index * 0.12, ease: EASE }}
      className={`opex-pgm-plate ${isUp ? "opex-pgm-plate-up" : "opex-pgm-plate-completed"} opex-pgm-plate-order`}
      style={{
        aspectRatio: isUp ? "3 / 2" : "4 / 3",
        boxShadow: isUp
          ? "inset 0 0 0 1px rgba(159,103,255,0.28), 0 30px 90px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.14)"
          : "inset 0 0 0 1px rgba(255,255,255,0.07)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ed.image}
        alt={`${ed.city} — OPEX First`}
        loading="lazy"
        decoding="async"
        style={
          isUp ? { filter: "brightness(0.55) saturate(1.05)" } : undefined
        }
      />

      {/* Seat / wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: isUp
            ? "linear-gradient(150deg, rgba(124,58,237,0.30), transparent 58%), linear-gradient(to top, #07051A 4%, rgba(7,5,26,0.35) 46%, transparent)"
            : "linear-gradient(to top, rgba(7,5,26,0.6), transparent 55%)",
        }}
      />

      {/* Crop marks */}
      <span className="opex-pgm-crop" style={{ top: 8, left: 8, borderTop: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}`, borderLeft: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}` }} />
      <span className="opex-pgm-crop" style={{ top: 8, right: 8, borderTop: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}`, borderRight: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}` }} />
      <span className="opex-pgm-crop" style={{ bottom: 8, left: 8, borderBottom: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}`, borderLeft: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}` }} />
      <span className="opex-pgm-crop" style={{ bottom: 8, right: 8, borderBottom: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}`, borderRight: `1px solid ${isUp ? "rgba(159,103,255,0.5)" : "rgba(159,103,255,0.32)"}` }} />

      {/* Running folio */}
      <span
        style={{
          position: "absolute",
          top: 14,
          left: 16,
          zIndex: 3,
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.5px",
          color: "rgba(255,255,255,0.6)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {ed.folio}
      </span>

      {/* Next-edition pill (upcoming) */}
      {isUp && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            zIndex: 3,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 999,
            background: "rgba(124,58,237,0.22)",
            border: "1px solid rgba(159,103,255,0.4)",
            backdropFilter: "blur(6px)",
            fontFamily: "var(--font-outfit)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: VIOLET_BRIGHT, boxShadow: `0 0 8px ${VIOLET_BRIGHT}` }} />
          Next Edition
        </span>
      )}

      {/* Play disc (completed) */}
      {onPlay && (
        <>
          <span className="opex-pgm-ring" />
          <button
            type="button"
            className="opex-pgm-disc"
            onClick={onPlay}
            aria-label={`Watch ${ed.city} highlights`}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M5 3.5L12 8L5 12.5V3.5Z" />
            </svg>
          </button>
        </>
      )}
    </motion.div>
  );

  const text = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.12, ease: EASE }}
      className="opex-pgm-textcol"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: mirrored ? "flex-end" : "flex-start",
        textAlign: mirrored ? "right" : "left",
      }}
    >
      {/* Entry kicker */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "2.4px",
          textTransform: "uppercase",
          color: isUp ? VIOLET_BRIGHT : "rgba(255,255,255,0.4)",
          marginBottom: 12,
        }}
      >
        {isUp ? (
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: VIOLET_BRIGHT, boxShadow: `0 0 8px ${VIOLET_BRIGHT}`, animation: "opexPulseRing 2.4s ease-in-out infinite" }} />
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={VIOLET} strokeWidth="1.4" />
            <path d="M5.5 8L7 9.5L10.5 6" stroke={VIOLET} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {ed.kicker}
      </span>

      {/* City headline */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: isUp ? "clamp(28px, 2.6vw, 38px)" : "clamp(26px, 2.4vw, 34px)",
          letterSpacing: "-0.8px",
          color: OFFWHITE,
          margin: 0,
          lineHeight: 1.05,
        }}
      >
        {ed.city}
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "0.42em", color: "rgba(255,255,255,0.38)", marginLeft: 8 }}>
          {ed.country}
        </span>
      </h3>

      {/* Edition ordinal tag */}
      {ed.editionLabel && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            alignSelf: "flex-start",
            marginTop: 10,
            padding: "4px 11px",
            borderRadius: 999,
            border: `1px solid ${isUp ? "rgba(159,103,255,0.42)" : "rgba(255,255,255,0.14)"}`,
            background: isUp ? "rgba(159,103,255,0.1)" : "rgba(255,255,255,0.04)",
            fontFamily: "var(--font-outfit)",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: isUp ? VIOLET_BRIGHT : "rgba(255,255,255,0.5)",
          }}
        >
          {ed.editionLabel}
        </span>
      )}

      {/* Caption / dek */}
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.5,
          color: isUp ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.44)",
          margin: "12px 0 0",
        }}
      >
        {isUp ? ed.dek : ed.caption}
      </p>

      {/* Hairline */}
      <span
        style={{
          width: 24,
          height: 1,
          background: isUp ? "rgba(159,103,255,0.3)" : "rgba(255,255,255,0.14)",
          margin: "16px 0",
        }}
      />

      {/* Completed: dateline + stat + watch link */}
      {!isUp && (
        <>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.4px",
              color: "rgba(255,255,255,0.34)",
            }}
          >
            {ed.dateline}
          </span>
          {ed.stat && (
            <span
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 13.5,
                color: "rgba(159,103,255,0.7)",
                marginTop: 6,
              }}
            >
              {ed.stat}
            </span>
          )}
          {onPlay && (
            <button type="button" className="opex-pgm-watch" onClick={onPlay}>
              Watch the film
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Upcoming: editorial underline CTA */}
      {isUp && (
        <span className="opex-pgm-cta">
          View the edition
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={OFFWHITE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </motion.div>
  );

  const inner = (
    <div className="opex-pgm-inner" style={{ gridTemplateColumns: cols }}>
      {mirrored ? (
        <>
          {text}
          {plate}
        </>
      ) : (
        <>
          {plate}
          {text}
        </>
      )}
    </div>
  );

  const numeral = (
    <span
      className={`opex-pgm-numeral ${isUp ? "opex-pgm-numeral-up" : ""}`}
      aria-hidden
      style={mirrored ? { right: "-4%" } : { left: "-4%" }}
    >
      {ed.num}
    </span>
  );

  if (isUp && ed.href) {
    return (
      <Link href={ed.href} className={`opex-pgm-entry opex-pgm-entry-up opex-pgm-uplink`}>
        {numeral}
        <span className="opex-pgm-spine">Cover Story · Next Live Edition</span>
        {inner}
      </Link>
    );
  }

  return (
    <div className="opex-pgm-entry">
      {numeral}
      {inner}
    </div>
  );
}
