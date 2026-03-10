"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

// Placeholder video — update when user provides URL
const mainVideo = {
  id: "PLACEHOLDER_VIDEO_ID",
  title: "OT Security First Highlights",
  thumbnail:
    "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=1280&q=80",
};

export default function OTVideoHighlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(48px, 6vw, 80px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
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
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: OT_CRIMSON,
                fontFamily: "var(--font-outfit)",
              }}
            >
              Event Highlights
            </span>
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
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

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
          }
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 80px ${OT_CRIMSON}08`,
            }}
          >
            {!isPlaying ? (
              <VideoThumbnail
                thumbnail={mainVideo.thumbnail}
                onPlay={() => setIsPlaying(true)}
              />
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1&rel=0`}
                title="OT Security First Highlights"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0 }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * VideoThumbnail — Industrial play button with crimson accents
 */
function VideoThumbnail({
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
        alt="Video thumbnail"
        className="w-full h-full object-cover transition-all"
        style={{
          filter: isHovered
            ? "brightness(0.6) saturate(0.9)"
            : "brightness(0.5) saturate(0.8)",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transitionDuration: "0.5s",
        }}
      />

      {/* Play Button — Angular style */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="flex items-center justify-center transition-all"
          style={{
            width: 72,
            height: 72,
            borderRadius: 8,
            background: isHovered ? OT_CRIMSON : "rgba(211, 75, 154, 0.9)",
            boxShadow: isHovered
              ? `0 0 30px ${OT_CRIMSON}60`
              : `0 0 20px ${OT_CRIMSON}30`,
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
            opacity: isHovered ? 1 : 0.8,
          }}
        >
          Watch the Highlights
        </p>
      </div>
    </div>
  );
}
