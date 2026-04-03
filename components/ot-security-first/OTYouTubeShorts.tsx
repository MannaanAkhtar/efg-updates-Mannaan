"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_COLOR = "#D34B9A";
const OT_BG = "#050a0f";
const EASE = [0.16, 1, 0.3, 1] as const;

const shorts = [
  { id: "ot-1", videoId: "Q0n_sVaMnxg", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/Q0n_sVaMnxg/hqdefault.jpg" },
  { id: "ot-2", videoId: "SF87voLk34A", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/SF87voLk34A/hqdefault.jpg" },
  { id: "ot-3", videoId: "R5dtc5kjiQU", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/R5dtc5kjiQU/hqdefault.jpg" },
  { id: "ot-4", videoId: "Hm_yj3NttPo", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/Hm_yj3NttPo/hqdefault.jpg" },
  { id: "ot-5", videoId: "aaG9We6AjY8", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/aaG9We6AjY8/hqdefault.jpg" },
];

export default function OTYouTubeShorts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{ background: OT_BG, padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: OT_COLOR }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: OT_COLOR }}>
              From the Room
            </span>
            <span style={{ width: 30, height: 1, background: OT_COLOR }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-1px", color: "white", lineHeight: 1.15, margin: "16px 0 0" }}>
            Hear It From the Room
          </h2>
        </motion.div>

        {/* Shorts Row — 5 videos in a row, wraps on smaller screens */}
        <div className="ot-shorts-row" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {shorts.map((short, index) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08, ease: EASE }}
            >
              <OTShortCard short={short} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .ot-shorts-row { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .ot-shorts-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

function OTShortCard({ short }: { short: (typeof shorts)[0] }) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "3 / 4",
        borderRadius: 14,
        border: `1px solid ${hovered ? "rgba(211,75,154,0.3)" : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(211,75,154,0.1)` : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPlaying(true)}
    >
      {!playing ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={short.thumbnail}
            alt={short.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: hovered ? "brightness(0.5) saturate(0.9)" : "brightness(0.35) saturate(0.7)",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, ${OT_BG}E6 0%, ${OT_BG}33 50%, ${OT_BG}66 100%)` }} />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center transition-all" style={{
              width: 48, height: 48, borderRadius: "50%",
              background: hovered ? OT_COLOR : `${OT_COLOR}CC`,
              boxShadow: hovered ? `0 0 20px rgba(211,75,154,0.5), 0 0 40px rgba(211,75,154,0.2)` : `0 0 12px rgba(211,75,154,0.3)`,
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transitionDuration: "0.3s",
            }}>
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ marginLeft: 2 }}>
                <path d="M14 9L2 17V1L14 9Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: OT_COLOR, opacity: hovered ? 0.8 : 0, transition: "opacity 0.3s" }} />
        </>
      ) : (
        <iframe
          width="100%" height="100%"
          src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&rel=0`}
          title={short.title} frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, border: "none" }}
        />
      )}
    </div>
  );
}
