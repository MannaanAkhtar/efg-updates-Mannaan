"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OPEX_COLOR = "#7C3AED";
const OPEX_BG = "#0A0A0A";
const EASE = [0.16, 1, 0.3, 1] as const;

const shorts = [
  { id: "opex-1", videoId: "WCsfo5Z6xVY", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/WCsfo5Z6xVY/hqdefault.jpg" },
  { id: "opex-2", videoId: "baCK3xnKh68", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/baCK3xnKh68/hqdefault.jpg" },
  { id: "opex-3", videoId: "vMv0AfXMQL0", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/vMv0AfXMQL0/hqdefault.jpg" },
  { id: "opex-4", videoId: "AefPAed0g-I", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/AefPAed0g-I/hqdefault.jpg" },
  { id: "opex-5", videoId: "AefPAed0g-I", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/AefPAed0g-I/hqdefault.jpg" },
  { id: "opex-6", videoId: "wLgYOHHB6o4", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/wLgYOHHB6o4/hqdefault.jpg" },
  { id: "opex-7", videoId: "2jpIlqo0HSY", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/2jpIlqo0HSY/hqdefault.jpg" },
  { id: "opex-8", videoId: "SLkj5gO-LQ8", title: "Sponsor Interview", thumbnail: "https://img.youtube.com/vi/SLkj5gO-LQ8/hqdefault.jpg" },
];

export default function OpexYouTubeShorts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{ background: OPEX_BG, padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}
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
            <span style={{ width: 30, height: 1, background: OPEX_COLOR }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: OPEX_COLOR }}>
              From the Room
            </span>
            <span style={{ width: 30, height: 1, background: OPEX_COLOR }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-1px", color: "white", lineHeight: 1.15, margin: "16px 0 0" }}>
            Hear It From the Room
          </h2>
        </motion.div>

        {/* 4x2 Grid */}
        <div className="opex-shorts-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {shorts.map((short, index) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.06, ease: EASE }}
            >
              <OpexShortCard short={short} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .opex-shorts-row { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .opex-shorts-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

function OpexShortCard({ short }: { short: (typeof shorts)[0] }) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "3 / 4",
        borderRadius: 14,
        border: `1px solid ${hovered ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(124,58,237,0.1)` : "none",
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
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, ${OPEX_BG}E6 0%, ${OPEX_BG}33 50%, ${OPEX_BG}66 100%)` }} />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center transition-all" style={{
              width: 48, height: 48, borderRadius: "50%",
              background: hovered ? OPEX_COLOR : `${OPEX_COLOR}CC`,
              boxShadow: hovered ? `0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2)` : `0 0 12px rgba(124,58,237,0.3)`,
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transitionDuration: "0.3s",
            }}>
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ marginLeft: 2 }}>
                <path d="M14 9L2 17V1L14 9Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: OPEX_COLOR, opacity: hovered ? 0.8 : 0, transition: "opacity 0.3s" }} />
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
