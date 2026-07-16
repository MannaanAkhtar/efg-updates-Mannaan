"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import type { SpeakerWithSeries } from "@/lib/supabase/types";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

interface FallbackSpeaker {
  name: string;
  role: string;
  org: string;
  image: string | null;
}

interface DisplaySpeaker {
  id: string;
  name: string;
  role: string;
  org: string;
  image: string | null;
  initial: string;
  tag?: string;
}

function normalizeSpeakers(
  speakers?: SpeakerWithSeries[],
  fallback?: FallbackSpeaker[]
): DisplaySpeaker[] {
  if (speakers && speakers.length > 0) {
    return speakers.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.title ?? "",
      org: s.organization ?? "",
      image: s.image_url,
      initial: s.name.charAt(0),
    }));
  }
  if (fallback && fallback.length > 0) {
    return fallback.map((s, i) => ({
      id: `fallback-${i}`,
      name: s.name,
      role: s.role,
      org: s.org,
      image: s.image,
      initial: s.name.charAt(0),
    }));
  }
  return [];
}

export default function OpexSpeakersGrid({
  speakers,
  fallbackSpeakers,
  extraSpeakers,
}: {
  speakers?: SpeakerWithSeries[];
  fallbackSpeakers?: FallbackSpeaker[];
  extraSpeakers?: (FallbackSpeaker & { tag?: string })[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const base = normalizeSpeakers(speakers, fallbackSpeakers);
  const extras: DisplaySpeaker[] = (extraSpeakers ?? []).map((s, i) => ({
    id: `extra-${i}`,
    name: s.name,
    role: s.role,
    org: s.org,
    image: s.image,
    initial: s.name.charAt(0),
    tag: s.tag,
  }));
  const all = [...base, ...extras];
  if (all.length === 0) return null;

  // Split across two rows (alternating so tags/orgs distribute evenly)
  const rowTop = all.filter((_, i) => i % 2 === 0);
  const rowBottom = all.filter((_, i) => i % 2 === 1);

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
      {/* ── Editorial header ─────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <div className="opex-fac-head">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="opex-fac-head-left"
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
                The Faculty
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
              Speakers &amp; Advisors
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
              The Leaders Driving{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
                Excellence.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="opex-fac-head-dek"
          >
            Government excellence advisors, corporate transformation leaders,
            and global technology pioneers — across our summits and the virtual
            edition.
          </motion.p>
        </div>

        <div className="opex-fac-rule" />
      </div>

      {/* ── Two-row marquee (full-bleed) ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="opex-fac-marquee"
      >
        <MarqueeRow speakers={rowTop} direction="left" duration={72} />
        <MarqueeRow speakers={rowBottom} direction="right" duration={64} />
      </motion.div>

      {/* ── View-all CTA ─────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="opex-fac-more"
        >
          <Link href="/speakers" className="opex-fac-more-link">
            View all speakers
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-fac-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: clamp(24px, 4vw, 56px);
        }
        .opex-fac-head-dek {
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
        .opex-fac-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(28px, 3.5vw, 44px) 0 0;
        }

        .opex-fac-marquee {
          margin: clamp(30px, 4vw, 46px) 0 clamp(34px, 4vw, 50px);
          display: flex;
          flex-direction: column;
          gap: clamp(18px, 2vw, 26px);
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            #000 7%,
            #000 93%,
            transparent 100%
          );
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            #000 7%,
            #000 93%,
            transparent 100%
          );
        }
        .opex-fac-row {
          display: flex;
          overflow: hidden;
        }
        .opex-fac-track {
          display: flex;
          gap: clamp(16px, 1.6vw, 22px);
          flex-shrink: 0;
          width: max-content;
          will-change: transform;
        }
        .opex-fac-track-left {
          animation: opexMarqueeLeft linear infinite;
        }
        .opex-fac-track-right {
          animation: opexMarqueeRight linear infinite;
        }
        .opex-fac-row:hover .opex-fac-track {
          animation-play-state: paused;
        }
        @keyframes opexMarqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes opexMarqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .opex-fac-card {
          position: relative;
          width: clamp(178px, 19vw, 216px);
          flex-shrink: 0;
        }
        .opex-fac-plate {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }
        .opex-fac-plate img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(0.4) brightness(0.72) contrast(1.02);
          transition: filter 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-fac-card:hover .opex-fac-plate img {
          filter: grayscale(0) brightness(0.92);
          transform: scale(1.045);
        }
        .opex-fac-crop {
          position: absolute;
          width: 12px;
          height: 12px;
          z-index: 3;
          pointer-events: none;
          transition: border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-fac-card:hover .opex-fac-crop {
          border-color: rgba(159, 103, 255, 0.6) !important;
        }
        .opex-fac-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.28);
          border: 1px solid rgba(159, 103, 255, 0.42);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          font-family: var(--font-outfit);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: #fff;
        }
        .opex-fac-tag-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${VIOLET_BRIGHT};
          box-shadow: 0 0 6px ${VIOLET_BRIGHT};
        }
        .opex-fac-mono {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(150deg, rgba(124, 58, 237, 0.16), rgba(124, 58, 237, 0.04));
        }
        .opex-fac-mono span {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(40px, 4.6vw, 56px);
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(159, 103, 255, 0.4);
        }
        .opex-fac-info {
          padding-top: 13px;
        }
        .opex-fac-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.2px;
          line-height: 1.2;
          color: ${OFFWHITE};
          margin: 0;
          transition: color 0.4s;
        }
        .opex-fac-card:hover .opex-fac-name {
          color: ${VIOLET_BRIGHT};
        }
        .opex-fac-role {
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: 12px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.5);
          margin: 6px 0 0;
        }
        .opex-fac-org {
          font-family: ${SERIF};
          font-style: italic;
          font-size: 12px;
          line-height: 1.4;
          color: rgba(159, 103, 255, 0.78);
          margin: 4px 0 0;
        }

        .opex-fac-more {
          display: flex;
          justify-content: center;
          margin-top: clamp(8px, 1.5vw, 16px);
        }
        .opex-fac-more-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 24px;
          border: 1px solid rgba(159, 103, 255, 0.3);
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.06);
          text-decoration: none;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: rgba(255, 255, 255, 0.82);
          transition: color 0.4s, border-color 0.4s, background 0.4s;
        }
        .opex-fac-more-link:hover {
          color: #fff;
          border-color: rgba(159, 103, 255, 0.55);
          background: rgba(124, 58, 237, 0.14);
        }
        .opex-fac-more-link svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-fac-more-link:hover svg {
          transform: translateX(3px);
        }

        @media (max-width: 760px) {
          .opex-fac-head {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }
          .opex-fac-head-dek {
            max-width: 42ch;
            padding-bottom: 0;
          }
          .opex-fac-card {
            width: clamp(150px, 52vw, 190px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-fac-track-left,
          .opex-fac-track-right {
            animation: none !important;
          }
          .opex-fac-row {
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Marquee Row ─────────────────────────────────────────── */

function MarqueeRow({
  speakers,
  direction,
  duration,
}: {
  speakers: DisplaySpeaker[];
  direction: "left" | "right";
  duration: number;
}) {
  if (speakers.length === 0) return null;
  // Duplicate the set so the -50% translate loops seamlessly.
  const doubled = [...speakers, ...speakers];

  return (
    <div className="opex-fac-row">
      <div
        className={`opex-fac-track ${direction === "left" ? "opex-fac-track-left" : "opex-fac-track-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((s, i) => (
          <SpeakerCard key={`${s.id}-${i}`} speaker={s} />
        ))}
      </div>
    </div>
  );
}

/* ─── Speaker Card ────────────────────────────────────────── */

function SpeakerCard({ speaker }: { speaker: DisplaySpeaker }) {
  return (
    <div className="opex-fac-card">
      <div className="opex-fac-plate">
        {speaker.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={speaker.image} alt={speaker.name} loading="lazy" decoding="async" />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: "linear-gradient(to top, rgba(7,5,26,0.55), transparent 52%)",
              }}
            />
          </>
        ) : (
          <div className="opex-fac-mono">
            <span>{speaker.initial}</span>
          </div>
        )}

        <span className="opex-fac-crop" style={{ top: 8, left: 8, borderTop: "1px solid rgba(159,103,255,0.34)", borderLeft: "1px solid rgba(159,103,255,0.34)" }} />
        <span className="opex-fac-crop" style={{ top: 8, right: 8, borderTop: "1px solid rgba(159,103,255,0.34)", borderRight: "1px solid rgba(159,103,255,0.34)" }} />
        <span className="opex-fac-crop" style={{ bottom: 8, left: 8, borderBottom: "1px solid rgba(159,103,255,0.34)", borderLeft: "1px solid rgba(159,103,255,0.34)" }} />
        <span className="opex-fac-crop" style={{ bottom: 8, right: 8, borderBottom: "1px solid rgba(159,103,255,0.34)", borderRight: "1px solid rgba(159,103,255,0.34)" }} />
      </div>

      <div className="opex-fac-info">
        <h4 className="opex-fac-name">{speaker.name}</h4>
        {speaker.role && <p className="opex-fac-role">{speaker.role}</p>}
        {speaker.org && <p className="opex-fac-org">{speaker.org}</p>}
      </div>
    </div>
  );
}
