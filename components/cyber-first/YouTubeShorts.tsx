"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING } from "@/lib/cyber-design-tokens";

// YouTube Shorts, using real event highlight video IDs
const shorts = [
  {
    id: "short-1",
    videoId: "jPQFjwuohfI",
    title: "Sponsor Interview",
    thumbnail: "https://img.youtube.com/vi/jPQFjwuohfI/hqdefault.jpg",
  },
  {
    id: "short-2",
    videoId: "c8sPwIo4Pis",
    title: "Sponsor Interview",
    thumbnail: "https://img.youtube.com/vi/c8sPwIo4Pis/hqdefault.jpg",
  },
  {
    id: "short-3",
    videoId: "2LoeDNqsem0",
    title: "Sponsor Interview",
    thumbnail: "https://img.youtube.com/vi/2LoeDNqsem0/hqdefault.jpg",
  },
  {
    id: "short-4",
    videoId: "8C61dof_f3s",
    title: "Sponsor Interview",
    thumbnail: "https://img.youtube.com/vi/8C61dof_f3s/hqdefault.jpg",
  },
  {
    id: "short-5",
    videoId: "2-KXhfSeBdQ",
    title: "Sponsor Interview",
    thumbnail: "https://img.youtube.com/vi/2-KXhfSeBdQ/hqdefault.jpg",
  },
  {
    id: "short-6",
    videoId: "2IwKmGEfOIo",
    title: "Sponsor Interview",
    thumbnail: "https://img.youtube.com/vi/2IwKmGEfOIo/hqdefault.jpg",
  },
];

export default function YouTubeShorts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgBase,
        padding: `${SPACING.sectionPadding} 0`,
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: SPACING.maxWidth,
          margin: "0 auto",
          padding: `0 ${SPACING.containerPadding}`,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: ANIMATION.ease }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              From the Room
            </span>
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
          </div>

          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "-1px",
              color: COLORS.textPrimary,
              lineHeight: 1.15,
              margin: "16px 0 0",
            }}
          >
            Hear It From the Room
          </h2>
        </motion.div>

        {/* Shorts Row */}
        <div
          className="shorts-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {shorts.map((short, index) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.08,
                ease: ANIMATION.ease,
              }}
            >
              <ShortCard short={short} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .shorts-row {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .shorts-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .shorts-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ShortCard, Vertical video card (9:16 ratio) with play overlay
 */
function ShortCard({
  short,
}: {
  short: (typeof shorts)[0];
}) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "3 / 4",
        borderRadius: RADIUS.lg,
        border: `1px solid ${hovered ? COLORS.borderAccent : COLORS.borderSubtle}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? SHADOWS.cardHover : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPlaying(true)}
    >
      {!playing ? (
        <>
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={short.thumbnail}
            alt={short.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: hovered
                ? "brightness(0.5) saturate(0.9)"
                : "brightness(0.35) saturate(0.7)",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${COLORS.bgDeep}E6 0%, ${COLORS.bgDeep}33 50%, ${COLORS.bgDeep}66 100%)`,
            }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="flex items-center justify-center transition-all"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: hovered ? COLORS.cyan : `${COLORS.cyan}CC`,
                boxShadow: hovered
                  ? SHADOWS.cyanGlowStrong
                  : SHADOWS.cyanGlow,
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transitionDuration: "0.3s",
              }}
            >
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                style={{ marginLeft: 2 }}
              >
                <path
                  d="M14 9L2 17V1L14 9Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>


          {/* Blue accent line at bottom on hover */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 2,
              background: COLORS.cyan,
              opacity: hovered ? 0.8 : 0,
              transition: "opacity 0.3s",
            }}
          />
        </>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&rel=0`}
          title={short.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            border: "none",
          }}
        />
      )}
    </div>
  );
}
