"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";

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
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SERIES_COLORS: Record<string, { bg: string; border: string }> = {
  "Cyber First": { bg: "linear-gradient(135deg, rgba(1,187,245,0.3) 0%, rgba(1,187,245,0.15) 100%)", border: "rgba(1,187,245,0.3)" },
  "OT Security First": { bg: "linear-gradient(135deg, rgba(211,75,154,0.3) 0%, rgba(211,75,154,0.15) 100%)", border: "rgba(211,75,154,0.3)" },
  "OPEX First": { bg: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.15) 100%)", border: "rgba(124,58,237,0.3)" },
  "Digital First": { bg: "linear-gradient(135deg, rgba(15,115,94,0.3) 0%, rgba(15,115,94,0.15) 100%)", border: "rgba(15,115,94,0.3)" },
  "NetworkFirst": { bg: "linear-gradient(135deg, rgba(201,147,90,0.3) 0%, rgba(201,147,90,0.15) 100%)", border: "rgba(201,147,90,0.3)" },
};

const HIGHLIGHT_VIDEOS = [
  // Bento grid (first 6): 1 per series + NetworkFirst
  { id: "3ofcPquafgk", title: "OT Security First UAE", series: "OT Security First" },
  { id: "AsrScRfgLpA", title: "Cyber First UAE", series: "Cyber First" },
  { id: "5obYKv-vJZE", title: "OPEX First UAE", series: "OPEX First" },
  { id: "-a481Lbz55o", title: "Digital First KSA", series: "Digital First" },
  { id: "JA1X4cN2-t0", title: "CleverTap NetworkFirst", series: "NetworkFirst" },
  { id: "0d_2Itsg6ec", title: "Cyber First Qatar", series: "Cyber First" },
  // Marquee
  { id: "dbL42utoYW4", title: "OPEX First KSA", series: "OPEX First" },
  { id: "gR-IUI7yJLg", title: "Cyber First Kuwait 3rd Edition", series: "Cyber First" },
  { id: "wcEeU0UEl0o", title: "Cyber First Kuwait", series: "Cyber First" },
  { id: "Bc3L3iTsaIg", title: "Digital First Qatar", series: "Digital First" },
  { id: "IsMPomtqH5U", title: "Digital First Qatar", series: "Digital First" },
  { id: "3uvw31I1tq8", title: "Enterprise OPS Conference", series: "OPEX First" },
  { id: "6H11mOM-aJc", title: "Digital First Egypt", series: "Digital First" },
  { id: "kjro4AVXUhM", title: "Digital First Egypt", series: "Digital First" },
  { id: "8xluYDV_07g", title: "Digital First Egypt", series: "Digital First" },
  { id: "ktsauwzmb-Q", title: "Digital First Egypt", series: "Digital First" },
  { id: "iFVU9upOXyM", title: "Digital First Egypt", series: "Digital First" },
  { id: "_ogyuzwQWYo", title: "Digital First Egypt", series: "Digital First" },
  { id: "j7g0eRb7hsQ", title: "Digital First Egypt", series: "Digital First" },
  { id: "Klt-iNu1g4g", title: "Digital First Egypt", series: "Digital First" },
  { id: "OYIX4ga3DI8", title: "Digital First Egypt", series: "Digital First" },
];

const BENTO_COUNT = 6;

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO CARD
// ─────────────────────────────────────────────────────────────────────────────

function HighlightCard({
  videoId,
  title,
  series,
  isHero,
}: {
  videoId: string;
  title: string;
  series: string;
  isHero?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="eh-card" onClick={() => !isPlaying && setIsPlaying(true)}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={`${title}, Events First Group technology summit video`}
            className="eh-thumb"
          />
          <div className="eh-overlay" />
          <div className="eh-play-wrap">
            <div className={`eh-play-btn ${isHero ? "eh-play-hero" : ""}`}>
              <svg
                width={isHero ? "18" : "14"}
                height={isHero ? "18" : "14"}
                viewBox="0 0 24 24"
                fill="white"
                style={{ marginLeft: 2 }}
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          <div className="eh-label">
            <span style={{
              background: SERIES_COLORS[series]?.bg || "rgba(255,255,255,0.1)",
              borderColor: SERIES_COLORS[series]?.border || "rgba(255,255,255,0.15)",
            }}>{series}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function EventHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const bentoVideos = HIGHLIGHT_VIDEOS.slice(0, BENTO_COUNT);
  const marqueeVideos = HIGHLIGHT_VIDEOS.slice(BENTO_COUNT);

  return (
    <section ref={sectionRef} className="eh-section">
      <EventHighlightsSchema videos={HIGHLIGHT_VIDEOS} />
      <div className="eh-glow" />

      <div className="eh-container">
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{ width: 24, height: 2, background: "#E8651A", borderRadius: 1 }} />
          <span style={{
            fontFamily: "var(--font-dm)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "#E8651A",
          }}>From the Stage</span>
        </div>

        <h2 className="eh-heading" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          Event Highlights
        </h2>

        <p className="eh-subtitle" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}>
          Keynotes, panels, and conversations captured live from our events worldwide.
        </p>

        {/* Bento Grid */}
        <div className="eh-bento" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}>
          {/* Hero — large card */}
          <div className="eh-bento-hero">
            <HighlightCard videoId={bentoVideos[0].id} title={bentoVideos[0].title} series={bentoVideos[0].series} isHero />
          </div>
          {/* Sidebar — 2 stacked */}
          <div className="eh-bento-side">
            <div className="eh-bento-side-card">
              <HighlightCard videoId={bentoVideos[1].id} title={bentoVideos[1].title} series={bentoVideos[1].series} />
            </div>
            <div className="eh-bento-side-card">
              <HighlightCard videoId={bentoVideos[2].id} title={bentoVideos[2].title} series={bentoVideos[2].series} />
            </div>
          </div>
          {/* Bottom row — 3 cards */}
          <div className="eh-bento-row">
            {bentoVideos.slice(3).map(v => (
              <div key={v.id} className="eh-bento-row-card">
                <HighlightCard videoId={v.id} title={v.title} series={v.series} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee — full width */}
      <div className="eh-marquee-wrap" style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s",
      }}>
        <div className="eh-marquee-track">
          {marqueeVideos.map(v => (
            <div key={v.id} className="eh-marquee-card">
              <HighlightCard videoId={v.id} title={v.title} series={v.series} />
            </div>
          ))}
          {marqueeVideos.map(v => (
            <div key={`d-${v.id}`} className="eh-marquee-card">
              <HighlightCard videoId={v.id} title={v.title} series={v.series} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .eh-section {
          background: #0A0A0A;
          padding: clamp(56px, 7vw, 90px) 0 clamp(40px, 5vw, 60px);
          position: relative;
          overflow: hidden;
        }

        .eh-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,101,26,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 20% 60%, rgba(1,187,245,0.02) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 60%, rgba(124,58,237,0.02) 0%, transparent 50%);
        }

        .eh-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 40px);
          position: relative;
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
          margin: 0 0 clamp(28px, 3.5vw, 40px);
          max-width: 540px;
        }

        /* ── Bento Grid ── */
        .eh-bento {
          display: grid;
          grid-template-columns: 3fr 2fr;
          grid-template-rows: 1fr 1fr auto;
          gap: clamp(10px, 1.5vw, 14px);
          margin-bottom: clamp(28px, 3vw, 40px);
        }

        .eh-bento-hero {
          grid-column: 1;
          grid-row: 1 / 3;
          aspect-ratio: 16 / 9;
        }

        .eh-bento-side {
          grid-column: 2;
          grid-row: 1 / 3;
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.5vw, 14px);
        }

        .eh-bento-side-card {
          flex: 1;
          min-height: 0;
        }

        .eh-bento-row {
          grid-column: 1 / -1;
          grid-row: 3;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 1.5vw, 14px);
        }

        .eh-bento-row-card {
          aspect-ratio: 16 / 9;
        }

        /* ── Card ── */
        .eh-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .eh-card:hover {
          border-color: rgba(232,101,26,0.3);
          box-shadow: 0 16px 48px rgba(232,101,26,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }
        .eh-card:hover .eh-thumb {
          transform: scale(1.04);
        }
        .eh-card:hover .eh-play-btn {
          background: rgba(232,101,26,0.9);
          border-color: rgba(232,101,26,0.4);
          transform: scale(1.2);
          box-shadow: 0 0 0 8px rgba(232,101,26,0.12), 0 4px 16px rgba(232,101,26,0.25);
        }
        .eh-card:hover .eh-label span {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3);
        }

        /* Thumbnail */
        .eh-thumb {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }

        /* Overlay — bottom only */
        .eh-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%);
        }

        /* Play button — Apple-like */
        .eh-play-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .eh-play-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: eh-pulse 3s ease-in-out infinite;
        }
        .eh-play-hero {
          width: 64px;
          height: 64px;
        }

        @keyframes eh-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0.04); }
        }

        /* Label badge — liquid glass */
        .eh-label {
          position: absolute;
          bottom: 10px;
          left: 10px;
          z-index: 2;
        }
        .eh-label span {
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #fff;
          padding: 4px 10px;
          border-radius: 50px;
          border-style: solid;
          border-width: 1px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.25);
          transition: box-shadow 0.3s ease;
        }

        /* ── Marquee ── */
        .eh-marquee-wrap {
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
        }
        .eh-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: eh-scroll 60s linear infinite;
        }
        .eh-marquee-track:hover {
          animation-play-state: paused;
        }
        .eh-marquee-card {
          width: 280px;
          aspect-ratio: 16 / 9;
          flex-shrink: 0;
        }

        @keyframes eh-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .eh-bento {
            grid-template-columns: 1fr;
          }
          .eh-bento-hero {
            grid-column: 1;
            aspect-ratio: 16 / 9;
          }
          .eh-bento-side {
            grid-column: 1;
            flex-direction: row;
          }
          .eh-bento-side-card {
            aspect-ratio: 16 / 9;
          }
          .eh-bento-row {
            grid-column: 1;
            grid-template-columns: repeat(3, 1fr);
          }
          .eh-marquee-card {
            width: 220px;
          }
        }

        @media (max-width: 560px) {
          .eh-bento-row {
            grid-template-columns: 1fr 1fr;
          }
          .eh-bento-side {
            flex-direction: column;
          }
          .eh-bento-side-card {
            aspect-ratio: 16 / 9;
          }
          .eh-marquee-card {
            width: 180px;
          }
          .eh-play-hero {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </section>
  );
}
