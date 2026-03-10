"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

// Conference Chair data
const chair = {
  name: "Ali Al Kaf Alhashmi",
  title: "VP Cyber Security & Technology",
  company: "Mubadala",
  photo:
    "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Ali-Al-Kaf-Alhashmi.png",
  quote:
    "OT Security First brings together the region\u2019s most critical voices in industrial cybersecurity. This is where we move from reactive to proactive \u2014 where the defenders of our power grids, oil fields, and water systems share the hard-won lessons that keep nations running.",
};

// Testimonial YT Shorts
const testimonialShorts = [
  { id: "SH9Z1U2_rAM", label: "Industry Voice" },
  { id: "wLgYOHHB6o4", label: "CISO Perspective" },
  { id: "2jpIlqo0HSY", label: "OT Leader" },
  { id: "SLkj5gO-LQ8", label: "Expert Insight" },
];

export default function OTChairQuote() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 20% 50%, ${OT_CRIMSON}08 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Chair Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="quote-layout relative flex items-center gap-12"
        >
          {/* Left border accent */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: `linear-gradient(to bottom, ${OT_CRIMSON} 0%, ${OT_CRIMSON}40 100%)`,
              borderRadius: 2,
            }}
          />

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="flex-shrink-0"
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid ${OT_CRIMSON}40`,
                boxShadow: `0 0 40px ${OT_CRIMSON}20`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={chair.photo}
                alt={chair.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <div style={{ paddingLeft: 20 }}>
            {/* Quote mark */}
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 60,
                color: OT_CRIMSON,
                opacity: 0.3,
                lineHeight: 0,
                position: "absolute",
                top: -10,
                left: 160,
              }}
            >
              &ldquo;
            </span>

            {/* Quote text */}
            <blockquote
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "#C0C0C0",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {chair.quote}
            </blockquote>

            {/* Attribution */}
            <div style={{ marginTop: 24 }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--white)",
                  margin: 0,
                }}
              >
                {chair.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#707070",
                  margin: "4px 0 0",
                }}
              >
                {chair.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: `${OT_CRIMSON}B3`,
                  margin: "2px 0 0",
                }}
              >
                {chair.company} &middot; Conference Chair
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonial Shorts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          style={{ marginTop: 48 }}
        >
          {/* Sub-header */}
          <div
            className="flex items-center gap-3"
            style={{ marginBottom: 20 }}
          >
            <span style={{ width: 20, height: 1, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#686868",
              }}
            >
              Voices from the Summit
            </span>
          </div>

          {/* Shorts Grid */}
          <div
            className="ot-shorts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {testimonialShorts.map((short, index) => (
              <ShortCard
                key={short.id}
                short={short}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a
              href="#register"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: OT_CRIMSON,
                textDecoration: "none",
                letterSpacing: "0.5px",
              }}
            >
              Join the Conversation →
            </a>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .quote-layout {
            flex-direction: column !important;
            text-align: center !important;
            gap: 24px !important;
          }
          .quote-layout > div:last-child {
            padding-left: 0 !important;
          }
          .ot-shorts-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .ot-shorts-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ShortCard — Vertical YT Short with click-to-play + angular play button
 */
function ShortCard({
  short,
  index,
  isInView,
}: {
  short: (typeof testimonialShorts)[0];
  index: number;
  isInView: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: EASE }}
    >
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          aspectRatio: "9 / 16",
          borderRadius: 10,
          background: "#141414",
          border: isHovered
            ? `1px solid ${OT_CRIMSON}30`
            : "1px solid rgba(255, 255, 255, 0.05)",
          transition: "border-color 0.3s",
        }}
        onClick={() => setIsPlaying(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isPlaying ? (
          <>
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${short.id}/hqdefault.jpg`}
              alt={short.label}
              className="w-full h-full object-cover transition-all"
              style={{
                filter: isHovered
                  ? "brightness(0.5) saturate(0.9)"
                  : "brightness(0.35) saturate(0.7)",
                transform: isHovered ? "scale(1.03)" : "scale(1)",
                transitionDuration: "0.5s",
              }}
            />

            {/* Left edge bar */}
            <div
              className="absolute left-0 top-0 bottom-0 z-10 transition-all"
              style={{
                width: 3,
                background: OT_CRIMSON,
                opacity: isHovered ? 1 : 0,
                transitionDuration: "0.3s",
              }}
            />

            {/* Play button — Angular OT style */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex items-center justify-center transition-all"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: isHovered
                    ? OT_CRIMSON
                    : "rgba(211, 75, 154, 0.85)",
                  boxShadow: isHovered
                    ? `0 0 24px ${OT_CRIMSON}50`
                    : `0 0 12px ${OT_CRIMSON}25`,
                  transform: isHovered ? "scale(1.06)" : "scale(1)",
                  transitionDuration: "0.3s",
                }}
              >
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 24 28"
                  fill="none"
                  style={{ marginLeft: 2 }}
                >
                  <path
                    d="M22 14L2 26V2L22 14Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Label at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 z-10"
              style={{ padding: "12px 14px" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "white",
                  opacity: 0.9,
                  margin: 0,
                }}
              >
                {short.label}
              </p>
            </div>

            {/* Bottom gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                height: "40%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              }}
            />
          </>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0`}
            title={short.label}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0 }}
          />
        )}
      </div>
    </motion.div>
  );
}
