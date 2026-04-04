"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Video schema for testimonials
function TestimonialVideoSchema({ videos }: { videos: { id: string; label: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Events First Group Testimonials",
    description: "Video testimonials from sponsors, delegates and speakers at Events First Group summits",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: `${video.label} - Events First Group Testimonial`,
        description: "Testimonial from Events First Group summit attendee",
        thumbnailUrl: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        uploadDate: "2025-01-01",
        publisher: {
          "@type": "Organization",
          name: "Events First Group",
          url: "https://eventsfirstgroup.com",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO SHORTS DATA
// ─────────────────────────────────────────────────────────────────────────────

const videoShorts = [
  // Cyber First (6)
  { id: "jPQFjwuohfI", label: "Cyber First" },
  { id: "c8sPwIo4Pis", label: "Cyber First" },
  { id: "2LoeDNqsem0", label: "Cyber First" },
  { id: "8C61dof_f3s", label: "Cyber First" },
  { id: "2-KXhfSeBdQ", label: "Cyber First" },
  { id: "2IwKmGEfOIo", label: "Cyber First" },
  // OT Security First (5)
  { id: "Q0n_sVaMnxg", label: "OT Security First" },
  { id: "SF87voLk34A", label: "OT Security First" },
  { id: "R5dtc5kjiQU", label: "OT Security First" },
  { id: "Hm_yj3NttPo", label: "OT Security First" },
  { id: "aaG9We6AjY8", label: "OT Security First" },
  // OPEX First (8, minus 3 duplicates with OT = 5 unique)
  { id: "WCsfo5Z6xVY", label: "OPEX First" },
  { id: "baCK3xnKh68", label: "OPEX First" },
  { id: "vMv0AfXMQL0", label: "OPEX First" },
  { id: "AefPAed0g-I", label: "OPEX First" },
  { id: "wLgYOHHB6o4", label: "OPEX First" },
  { id: "2jpIlqo0HSY", label: "OPEX First" },
  { id: "SLkj5gO-LQ8", label: "OPEX First" },
];

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO CARD, YouTube Shorts inline player
// ─────────────────────────────────────────────────────────────────────────────

function VideoCard({
  videoId,
  label,
  index,
  isInView,
}: {
  videoId: string;
  label: string;
  index: number;
  isInView: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.08 + index * 0.1, ease: EASE }}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Video container, 9:16 aspect for Shorts */}
      <div
        style={{
          position: "relative",
          aspectRatio: "9 / 13",
          background: "#0A0A0A",
          cursor: isPlaying ? "default" : "pointer",
        }}
        onClick={() => !isPlaying && setIsPlaying(true)}
      >
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        ) : (
          <>
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy"
              src={`https://img.youtube.com/vi/${videoId}/oar2.jpg`}
              alt={label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />

            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
              }}
            />

            {/* Play button */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(232,101,26,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(232,101,26,0.3)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="white"
                style={{ marginLeft: 2 }}
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>

            {/* Label at bottom */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 14,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                  letterSpacing: "0.3px",
                }}
              >
                {label}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO SHORTS GRID — show 6, expand to all
// ─────────────────────────────────────────────────────────────────────────────

function VideoShortsGrid({ isInView }: { isInView: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? videoShorts : videoShorts.slice(0, 6);

  return (
    <>
      <div
        className="testimonials-video-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "clamp(12px, 1.5vw, 18px)",
        }}
      >
        {visible.map((v, i) => (
          <VideoCard
            key={v.id}
            videoId={v.id}
            label={v.label}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Show All / Show Less button */}
      {videoShorts.length > 6 && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--orange)",
              background: "rgba(232,101,26,0.06)",
              border: "1px solid rgba(232,101,26,0.15)",
              padding: "10px 28px",
              borderRadius: 50,
              cursor: "pointer",
              transition: "all 0.3s ease",
              letterSpacing: "0.5px",
            }}
          >
            {showAll ? "Show Less" : `Show All ${videoShorts.length} Videos`}
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="testimonials-section relative overflow-hidden"
      style={{
        background: "var(--black)",
        padding: "clamp(60px, 8vw, 120px) 0 clamp(40px, 5vw, 64px)",
      }}
    >
      {/* Video Schema for SEO */}
      <TestimonialVideoSchema videos={videoShorts} />

      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,101,26,0.03) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 0% 50%, rgba(232,101,26,0.02) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 100% 30%, rgba(232,101,26,0.02) 0%, transparent 50%)
          `,
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ marginBottom: "clamp(32px, 4vw, 48px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  width: 30,
                  height: 1,
                  background: "var(--orange)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  fontFamily: "var(--font-outfit)",
                }}
              >
                Voices from the Room
              </span>
            </div>
          </motion.div>

          <div
            className="testimonials-header-row"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginTop: 14,
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(30px, 3.5vw, 48px)",
                letterSpacing: "-2px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Trusted by{" "}
              <span style={{ color: "var(--orange)" }}>5,000+</span>{" "}
              Executives
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="testimonials-stat-line"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: 14,
                color: "#505050",
                margin: 0,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Sponsors, delegates & speakers across 6+ global markets
            </motion.p>
          </div>
        </div>

        {/* ── VIDEO SHORTS GRID ── */}
        <VideoShortsGrid isInView={isInView} />
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 1200px) {
          .testimonials-video-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 960px) {
          .testimonials-video-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .testimonials-video-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .testimonials-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .testimonials-stat-line {
            white-space: normal !important;
          }
          .testimonials-section {
            padding-top: 60px !important;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
