"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

type Short = { id: string; videoId: string; label: string };

// Sponsor & partner voices captured on the floor — de-duplicated to unique reels.
const shorts: Short[] = [
  { id: "opex-1", videoId: "WCsfo5Z6xVY", label: "Sponsor Voices" },
  { id: "opex-2", videoId: "baCK3xnKh68", label: "Sponsor Voices" },
  { id: "opex-3", videoId: "vMv0AfXMQL0", label: "Sponsor Voices" },
  { id: "opex-4", videoId: "AefPAed0g-I", label: "Sponsor Voices" },
  { id: "opex-5", videoId: "wLgYOHHB6o4", label: "Sponsor Voices" },
  { id: "opex-6", videoId: "2jpIlqo0HSY", label: "Sponsor Voices" },
  { id: "opex-7", videoId: "SLkj5gO-LQ8", label: "Sponsor Voices" },
];

export default function OpexYouTubeShorts() {
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
        <div className="opex-yt-head">
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
                The Reel
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
              From the Room
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
              Voices from the{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                floor.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-yt-dek"
          >
            Unscripted moments with the sponsors and partners who make the
            series what it is — captured between the sessions.
          </motion.p>
        </div>

        <div className="opex-yt-rule" />
      </div>

      {/* ── Full-bleed marquee of portrait reels ─────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="opex-yt-marquee"
      >
        <div className="opex-yt-track">
          {[...shorts, ...shorts].map((s, i) => (
            <ReelPlate key={`${s.id}-${i}`} short={s} />
          ))}
        </div>
        <div className="opex-yt-fade" aria-hidden />
      </motion.div>

      <style jsx global>{`
        .opex-yt-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-yt-dek {
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
        .opex-yt-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 0;
        }

        .opex-yt-marquee {
          position: relative;
          margin-top: clamp(30px, 3.6vw, 46px);
        }
        .opex-yt-track {
          display: flex;
          gap: clamp(14px, 1.5vw, 20px);
          width: max-content;
          padding: 4px clamp(24px, 5vw, 80px);
          animation: opexYtMarquee 70s linear infinite;
          will-change: transform;
        }
        .opex-yt-marquee:hover .opex-yt-track {
          animation-play-state: paused;
        }
        @keyframes opexYtMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .opex-yt-fade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            #07051a 0%,
            transparent 6%,
            transparent 94%,
            #07051a 100%
          );
        }

        .opex-yt-plate {
          position: relative;
          flex-shrink: 0;
          width: clamp(260px, 21vw, 340px);
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
          transition: box-shadow 0.5s ${cubicVar()}, transform 0.5s ${cubicVar()};
        }
        .opex-yt-plate:hover {
          transform: translateY(-4px);
          box-shadow: inset 0 0 0 1px rgba(159, 103, 255, 0.4),
            0 18px 44px rgba(0, 0, 0, 0.5), 0 0 26px rgba(124, 58, 237, 0.16);
        }
        .opex-yt-plate img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.55) brightness(0.62) contrast(1.04);
          transition: filter 0.6s ${cubicVar()}, transform 0.6s ${cubicVar()};
        }
        .opex-yt-plate:hover img {
          filter: grayscale(0) brightness(0.82);
          transform: scale(1.06);
        }
        .opex-yt-plate-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to top,
            rgba(7, 5, 26, 0.9) 0%,
            rgba(7, 5, 26, 0.28) 46%,
            rgba(7, 5, 26, 0.12) 78%,
            rgba(7, 5, 26, 0.4) 100%
          );
        }
        .opex-yt-crop {
          position: absolute;
          width: 13px;
          height: 13px;
          z-index: 3;
          pointer-events: none;
          transition: border-color 0.5s ${cubicVar()};
        }
        .opex-yt-plate:hover .opex-yt-crop {
          border-color: rgba(159, 103, 255, 0.6) !important;
        }
        .opex-yt-disc {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(244, 242, 250, 0.9);
          box-shadow: 0 8px 26px rgba(0, 0, 0, 0.4);
          transition: background 0.4s, transform 0.4s ${cubicVar()},
            box-shadow 0.4s;
        }
        .opex-yt-plate:hover .opex-yt-disc {
          background: ${VIOLET};
          transform: translate(-50%, -50%) scale(1.08);
          box-shadow: 0 0 24px rgba(124, 58, 237, 0.55),
            0 0 48px rgba(124, 58, 237, 0.22);
        }
        .opex-yt-disc svg path {
          fill: ${VIOLET};
          transition: fill 0.4s;
        }
        .opex-yt-plate:hover .opex-yt-disc svg path {
          fill: #fff;
        }
        .opex-yt-cap {
          position: absolute;
          left: 15px;
          bottom: 14px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: ${SERIF};
          font-style: italic;
          font-size: 13.5px;
          color: #fff;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6);
        }
        .opex-yt-cap-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${VIOLET_BRIGHT};
          box-shadow: 0 0 8px ${VIOLET_BRIGHT};
        }
        .opex-yt-frame {
          position: absolute;
          inset: 0;
          border: none;
        }

        @media (max-width: 760px) {
          .opex-yt-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-yt-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
          .opex-yt-plate {
            width: clamp(210px, 64vw, 280px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-yt-track {
            animation: none !important;
          }
          .opex-yt-marquee {
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}

function cubicVar() {
  return "cubic-bezier(0.16, 1, 0.3, 1)";
}

function ReelPlate({ short }: { short: Short }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <figure className="opex-yt-plate" style={{ cursor: "default" }}>
        <iframe
          className="opex-yt-frame"
          src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&rel=0`}
          title={short.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </figure>
    );
  }

  return (
    <figure className="opex-yt-plate" onClick={() => setPlaying(true)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`}
        alt={short.label}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="opex-yt-plate-scrim" />

      <span className="opex-yt-crop" style={{ top: 9, left: 9, borderTop: "1px solid rgba(159,103,255,0.34)", borderLeft: "1px solid rgba(159,103,255,0.34)" }} />
      <span className="opex-yt-crop" style={{ top: 9, right: 9, borderTop: "1px solid rgba(159,103,255,0.34)", borderRight: "1px solid rgba(159,103,255,0.34)" }} />
      <span className="opex-yt-crop" style={{ bottom: 9, left: 9, borderBottom: "1px solid rgba(159,103,255,0.34)", borderLeft: "1px solid rgba(159,103,255,0.34)" }} />
      <span className="opex-yt-crop" style={{ bottom: 9, right: 9, borderBottom: "1px solid rgba(159,103,255,0.34)", borderRight: "1px solid rgba(159,103,255,0.34)" }} />

      <div className="opex-yt-disc">
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ marginLeft: 2 }}>
          <path d="M14 9L2 17V1L14 9Z" />
        </svg>
      </div>

      <figcaption className="opex-yt-cap">
        <span className="opex-yt-cap-dot" />
        {short.label}
      </figcaption>
    </figure>
  );
}
