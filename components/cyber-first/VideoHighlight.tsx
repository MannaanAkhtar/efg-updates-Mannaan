"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING } from "@/lib/cyber-design-tokens";

// Main video
const mainVideo = {
  id: "gR-IUI7yJLg",
  title: "Cyber First Series Highlights",
  thumbnail: "https://img.youtube.com/vi/gR-IUI7yJLg/maxresdefault.jpg",
};

export default function VideoHighlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgDeep,
        padding: `${SPACING.sectionPadding} 0`,
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
          style={{ textAlign: "center", marginBottom: 40 }}
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
              Series Highlights
            </span>
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
          </div>

          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              ...TYPOGRAPHY.sectionTitle,
              color: COLORS.textPrimary,
              margin: "16px 0 0",
            }}
          >
            60 Seconds Inside Cyber First
          </h2>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2, ease: ANIMATION.ease }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: RADIUS.xl,
              overflow: "hidden",
              boxShadow: `${SHADOWS.xl}, 0 0 80px ${COLORS.cyanSubtle}`,
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
                title="Cyber First Highlights"
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
 * VideoThumbnail, Main video thumbnail with play button
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
        alt="Cyber First cybersecurity summit video"
        className="w-full h-full object-cover transition-all"
        style={{
          filter: isHovered
            ? "brightness(0.6) saturate(0.9)"
            : "brightness(0.5) saturate(0.8)",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transitionDuration: "0.5s",
        }}
      />

      {/* Play Button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="flex items-center justify-center transition-all"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: isHovered ? COLORS.cyan : `${COLORS.cyan}E6`,
            boxShadow: isHovered
              ? SHADOWS.cyanGlowStrong
              : SHADOWS.cyanGlow,
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
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textPrimary,
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
