"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EMERALD, EMERALD_BRIGHT, EASE, WIDE } from "./constants";

/* ─── Main highlight video ─── */
const mainVideo = {
  id: "Bc3L3iTsaIg",
  title: "Digital First Highlights",
  thumbnail: "https://img.youtube.com/vi/Bc3L3iTsaIg/maxresdefault.jpg",
};

/* ─── 4 YouTube Shorts ─── */
const shorts = [
  {
    videoId: "JA1X4cN2-t0",
    title: "Event Highlights",
    thumbnail: "https://img.youtube.com/vi/JA1X4cN2-t0/hqdefault.jpg",
  },
  {
    videoId: "-a481Lbz55o",
    title: "Event Highlights",
    thumbnail: "https://img.youtube.com/vi/-a481Lbz55o/hqdefault.jpg",
  },
  {
    videoId: "dbL42utoYW4",
    title: "Event Highlights",
    thumbnail: "https://img.youtube.com/vi/dbL42utoYW4/hqdefault.jpg",
  },
  {
    videoId: "gR-IUI7yJLg",
    title: "Event Highlights",
    thumbnail: "https://img.youtube.com/vi/gR-IUI7yJLg/hqdefault.jpg",
  },
];

export default function DAVideoHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0A0A0A",
        padding: "clamp(36px, 5vw, 56px) 0",
      }}
    >
      {/* Horizontal line texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(15,115,94,0.03) 5px, rgba(15,115,94,0.03) 6px)`,
          zIndex: 1,
        }}
      />

      {/* Emerald glow, center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 40%, ${EMERALD}08 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: WIDE,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: EMERALD }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: EMERALD,
              }}
            >
              Highlights
            </span>
            <span style={{ width: 30, height: 1, background: EMERALD }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            See It in Action
          </h2>
        </motion.div>

        {/* ─── Main Video Player ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={
            isInView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.96 }
          }
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${EMERALD}15`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 80px ${EMERALD}08`,
            }}
          >
            {!isPlaying ? (
              <MainThumbnail
                thumbnail={mainVideo.thumbnail}
                onPlay={() => setIsPlaying(true)}
              />
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1&rel=0`}
                title={mainVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, border: "none" }}
              />
            )}
          </div>
        </motion.div>

        {/* ─── Shorts Row ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginTop: 32 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#555555",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Quick Clips
          </p>
          <div
            className="da-shorts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {shorts.map((short, i) => (
              <motion.div
                key={short.videoId}
                initial={{ opacity: 0, y: 15 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 15 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.5 + i * 0.08,
                  ease: EASE,
                }}
              >
                <ShortCard short={short} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: EMERALD,
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            Be Part of the Next Chapter →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .da-shorts-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────── MAIN THUMBNAIL ─────────────────────────── */

function MainThumbnail({
  thumbnail,
  onPlay,
}: {
  thumbnail: string;
  onPlay: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute inset-0 cursor-pointer"
      onClick={onPlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt="Data AI First summit video thumbnail"
        className="w-full h-full object-cover transition-all"
        style={{
          filter: isHovered
            ? "brightness(0.55) saturate(0.9)"
            : "brightness(0.4) saturate(0.7)",
          transform: isHovered ? "scale(1.03)" : "scale(1)",
          transitionDuration: "0.6s",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%, rgba(10,10,10,0.3) 100%)`,
        }}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="flex items-center justify-center transition-all"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: isHovered ? EMERALD_BRIGHT : `${EMERALD}E6`,
            boxShadow: isHovered
              ? `0 0 30px ${EMERALD}60`
              : `0 0 20px ${EMERALD}30`,
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transitionDuration: "0.3s",
          }}
        >
          <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            style={{ marginLeft: 4 }}
          >
            <path
              d="M22 14L2 26V2L22 14Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p
          className="transition-opacity"
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            fontWeight: 500,
            color: "white",
            marginTop: 12,
            opacity: isHovered ? 1 : 0.7,
          }}
        >
          Watch the Highlights
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── SHORT CARD ─────────────────────────── */

function ShortCard({ short }: { short: (typeof shorts)[0] }) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "9 / 16",
        borderRadius: 14,
        border: `1px solid ${hovered ? `${EMERALD}20` : "rgba(255,255,255,0.05)"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.3)` : "none",
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
              background: `linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.4) 100%)`,
            }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center transition-all"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: hovered ? EMERALD_BRIGHT : `${EMERALD}CC`,
                boxShadow: hovered
                  ? `0 0 24px ${EMERALD}50`
                  : `0 0 12px ${EMERALD}25`,
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transitionDuration: "0.3s",
              }}
            >
              <svg
                width="14"
                height="16"
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

          {/* Emerald accent line at bottom on hover */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 2,
              background: EMERALD_BRIGHT,
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
          style={{ position: "absolute", inset: 0, border: "none" }}
        />
      )}
    </div>
  );
}
