"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Video schema for event highlights
function EventHighlightsSchema({ videos }: { videos: { id: string; title: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Events First Group Event Highlights",
    description: "Keynotes, panels, and conversations captured live from Events First Group summits",
    numberOfItems: videos.length,
    itemListElement: videos.slice(0, 6).map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: `Events First Group ${video.title}`,
        description: "Live capture from Events First Group technology summit",
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
// HIGHLIGHT VIDEOS DATA
// ─────────────────────────────────────────────────────────────────────────────

const HIGHLIGHT_VIDEOS = [
  { id: "JA1X4cN2-t0", title: "Event Highlights" },
  { id: "-a481Lbz55o", title: "Event Highlights" },
  { id: "dbL42utoYW4", title: "Event Highlights" },
  { id: "gR-IUI7yJLg", title: "Event Highlights" },
  { id: "0d_2Itsg6ec", title: "Event Highlights" },
  { id: "wcEeU0UEl0o", title: "Event Highlights" },
  { id: "Bc3L3iTsaIg", title: "Event Highlights" },
  { id: "3uvw31I1tq8", title: "Event Highlights" },
  { id: "6H11mOM-aJc", title: "Event Highlights" },
  { id: "kjro4AVXUhM", title: "Event Highlights" },
  { id: "8xluYDV_07g", title: "Event Highlights" },
  { id: "ktsauwzmb-Q", title: "Event Highlights" },
  { id: "iFVU9upOXyM", title: "Event Highlights" },
  { id: "_ogyuzwQWYo", title: "Event Highlights" },
  { id: "j7g0eRb7hsQ", title: "Event Highlights" },
  { id: "Klt-iNu1g4g", title: "Event Highlights" },
];

const INITIAL_SHOW = 6;

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO CARD
// ─────────────────────────────────────────────────────────────────────────────

function HighlightVideoCard({
  videoId,
  title,
  index,
}: {
  videoId: string;
  title: string;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      className="eh-card"
      onClick={() => !isPlaying && setIsPlaying(true)}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy"
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={`${title} — Events First Group technology summit video`}
            className="eh-thumb"
          />
          <div className="eh-overlay" />
          <div className="eh-play-wrap">
            <div className="eh-play-btn">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="white"
                style={{ marginLeft: 2 }}
              >
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function EventHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [showAll, setShowAll] = useState(false);

  const visibleVideos = showAll
    ? HIGHLIGHT_VIDEOS
    : HIGHLIGHT_VIDEOS.slice(0, INITIAL_SHOW);

  return (
    <section ref={sectionRef} className="eh-section">
      {/* Video Schema for SEO */}
      <EventHighlightsSchema videos={HIGHLIGHT_VIDEOS} />

      {/* Subtle top glow */}
      <div className="eh-glow" />

      <div className="eh-container">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="eh-eyebrow"
        >
          <span className="eh-eyebrow-line" />
          <span className="eh-eyebrow-text">From the Stage</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="eh-heading"
        >
          Highlights from Our Executive Technology Summits
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="eh-subtitle"
        >
          Keynotes, panels, and conversations captured live from our events
          worldwide.
        </motion.p>

        {/* Grid */}
        <div className="eh-grid">
          <AnimatePresence mode="popLayout">
            {visibleVideos.map((video, i) => (
              <HighlightVideoCard
                key={video.id}
                videoId={video.id}
                title={video.title}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Less */}
        {HIGHLIGHT_VIDEOS.length > INITIAL_SHOW && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            className="eh-toggle-wrap"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="eh-toggle-btn"
            >
              {showAll
                ? "Show Less"
                : `Show All ${HIGHLIGHT_VIDEOS.length} Videos`}
            </button>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        .eh-section {
          background: #0A0A0A;
          padding: clamp(60px, 7vw, 100px) 0;
          position: relative;
          overflow: hidden;
        }

        .eh-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 60% 40% at 50% 0%,
            rgba(232, 101, 26, 0.04) 0%,
            transparent 60%
          );
        }

        .eh-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 40px);
          position: relative;
        }

        /* Eyebrow */
        .eh-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .eh-eyebrow-line {
          width: 24px;
          height: 2px;
          background: #E8651A;
          border-radius: 1px;
        }
        .eh-eyebrow-text {
          font-family: var(--font-dm);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #E8651A;
        }

        /* Heading */
        .eh-heading {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px);
          letter-spacing: -1.5px;
          color: #ffffff;
          line-height: 1.15;
          margin: 0 0 8px;
        }

        /* Subtitle */
        .eh-subtitle {
          font-family: var(--font-outfit);
          font-weight: 300;
          font-size: clamp(14px, 1.2vw, 16px);
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.7;
          margin: 0 0 clamp(32px, 4vw, 48px);
          max-width: 540px;
        }

        /* Grid */
        .eh-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(12px, 2vw, 20px);
        }

        /* Card */
        .eh-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: border-color 0.3s, transform 0.3s;
        }
        .eh-card:hover {
          border-color: rgba(232, 101, 26, 0.2);
          transform: translateY(-2px);
        }

        .eh-thumb {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .eh-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.15) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        .eh-play-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .eh-play-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(232, 101, 26, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s, background 0.3s;
        }
        .eh-card:hover .eh-play-btn {
          transform: scale(1.1);
          background: rgba(255, 122, 46, 0.95);
        }

        /* Toggle */
        .eh-toggle-wrap {
          display: flex;
          justify-content: center;
          margin-top: clamp(28px, 3vw, 40px);
        }

        .eh-toggle-btn {
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 500;
          color: #E8651A;
          background: rgba(232, 101, 26, 0.08);
          border: 1px solid rgba(232, 101, 26, 0.2);
          border-radius: 100px;
          padding: 12px 32px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .eh-toggle-btn:hover {
          background: rgba(232, 101, 26, 0.14);
          border-color: rgba(232, 101, 26, 0.35);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .eh-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 560px) {
          .eh-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
