"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET_BRIGHT = "#9F67FF";
const INK = "#07051A";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

type Props = {
  image: string;
  alt: string;
  caption: string;
  folio: string; // roman numeral or index, e.g. "II"
  height?: string;
};

/**
 * Full-bleed cinematic photo band used as an editorial "image break" between
 * sections. Its top + bottom edges dissolve into the shared ink so the page
 * reads as one continuous magazine rather than stacked blocks.
 */
export default function OpexImageBreak({
  image,
  alt,
  caption,
  folio,
  height = "clamp(320px, 46vh, 560px)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="opex-imgbreak"
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={{ scale: 1.09 }}
        animate={inView ? { scale: 1 } : { scale: 1.09 }}
        transition={{ duration: 1.8, ease: EASE }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // natural cinematic: true colour, gently darkened to sit on the ink
          filter: "saturate(1.03) brightness(0.72) contrast(1.03)",
        }}
      />

      {/* Subtle violet grade from one corner */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(124,58,237,0.22) 0%, transparent 42%)",
          pointerEvents: "none",
        }}
      />

      {/* Edge blend — top & bottom melt into the shared ink field */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, ${INK} 0%, transparent 20%, transparent 58%, rgba(7,5,26,0.55) 82%, ${INK} 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Left vignette for caption legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(7,5,26,0.62) 0%, transparent 44%)",
          pointerEvents: "none",
        }}
      />

      {/* Editorial caption / folio */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        className="opex-imgbreak-cap"
        style={{
          position: "absolute",
          left: "clamp(22px, 5vw, 80px)",
          right: "clamp(22px, 5vw, 80px)",
          bottom: "clamp(20px, 4vw, 44px)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 6,
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: SERIF, fontStyle: "italic", color: VIOLET_BRIGHT }}>
            №
          </span>
          {folio}
        </span>
        <span
          style={{
            width: "clamp(20px, 4vw, 44px)",
            height: 1,
            background: "rgba(159,103,255,0.6)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(13px, 1.15vw, 16px)",
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.82)",
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        >
          {caption}
        </span>
      </motion.div>
    </div>
  );
}
